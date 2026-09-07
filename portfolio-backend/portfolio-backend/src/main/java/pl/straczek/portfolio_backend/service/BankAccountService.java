package pl.straczek.portfolio_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import pl.straczek.portfolio_backend.dto.CreateAccountRequest;
import pl.straczek.portfolio_backend.dto.ExchangeRequest;
import pl.straczek.portfolio_backend.dto.TransferRequest;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.model.Transaction;
import pl.straczek.portfolio_backend.model.Wallet;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;
import pl.straczek.portfolio_backend.repository.TransactionRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class BankAccountService
{
    private final BankAccountRepository accountRepository;
    private final AppUserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public BankAccountService(BankAccountRepository accountRepository,
                                 AppUserRepository userRepository,
                                 TransactionRepository transactionRepository)
    {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    private AppUser getUserByEmail(String email)
    {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new SecurityException("Cannot find such a user"));
    }

    @Transactional
    public String createAccount(String email, CreateAccountRequest request)
    {
        AppUser user = getUserByEmail(email);

        StringBuilder sb = new StringBuilder("PL");
        Random random = new Random();
        for (int i = 0; i < 26; i++)
            sb.append(random.nextInt(10));
        String accountNumber = sb.toString();

        BankAccount account = new BankAccount(accountNumber, user);
        account.setAccountType(request.accountType());
        account.setMultiCurrency(request.isMultiCurrency());

        Wallet defaultPlnWallet = new Wallet(request.baseCurrency(), new BigDecimal("100.00"), account);
        account.getWallets().add(defaultPlnWallet);
        accountRepository.save(account);

        return "Created an account for " + user.getUsername() + ". Account number: " + accountNumber
                + " | Base currency: " + request.baseCurrency();
    }

    @Transactional
    public void transferMoney(String email, TransferRequest request)
    {
        AppUser user = getUserByEmail(email);
        String transferCurrency = request.currency();

        BankAccount senderAccount = accountRepository.findByAccountNumber(request.fromAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Error: You don't have a bank account"));

        Wallet senderWallet = senderAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(transferCurrency))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Error: You don't have a " + transferCurrency + " wallet to send money from."));

        if (senderWallet.getBalance().compareTo(request.amount()) < 0)
            throw new IllegalArgumentException("Error: Too little money");

        if (request.amount().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Error: Amount must be a number above zero");

        BankAccount receiverAccount = accountRepository
                .findByAccountNumber(request.toAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Error: The receiver account doesn't exist"));

        Wallet receiverWallet = receiverAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(transferCurrency))
                .findFirst()
                .orElse(null);

        if (receiverWallet == null)
        {
            receiverWallet = new Wallet(transferCurrency, BigDecimal.ZERO, receiverAccount);
            receiverAccount.getWallets().add(receiverWallet);
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(request.amount()));
        receiverWallet.setBalance(receiverWallet.getBalance().add(request.amount()));

        // saving changes to the database
        accountRepository.save(senderAccount);
        accountRepository.save(receiverAccount);

        // tracking the history of transactions
        Transaction transaction = new Transaction(
                request.fromAccountNumber(),
                request.toAccountNumber(),
                request.amount(),
                transferCurrency,
                LocalDateTime.now()
        );
        transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionHistory(String email, String accountNumber)
    {
        AppUser user = getUserByEmail(email);

        BankAccount account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Error: This account doesn't exist"));

        if (!account.getOwner().getId().equals(user.getId()))
            throw new SecurityException("Error: You don't have permission to browse this account history");

        return transactionRepository.findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc(accountNumber, accountNumber);
    }

    public List<BankAccount> getMyAccounts(String email)
    {
        AppUser user = getUserByEmail(email);
        return accountRepository.findByOwner(user);
    }

    private BigDecimal getNbpRate(String currency) throws Exception
    {
        if (currency.equals("PLN"))
            return BigDecimal.ONE;

        RestTemplate restTemplate = new RestTemplate();
        String nbpUrl = "http://api.nbp.pl/api/exchangerates/rates/a/" + currency + "/?format=json";
        String response = restTemplate.getForObject(nbpUrl, String.class);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response);
        return new BigDecimal(root.path("rates").get(0).path("mid").asString());
    }

    @Transactional
    public String exchangeCurrency(String email, ExchangeRequest request) throws Exception
    {
        AppUser user = getUserByEmail(email);

        if (request.sourceCurrency().equals(request.targetCurrency()))
            throw new IllegalArgumentException("Error: Source and target currencies must be different");

        if (request.amount().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Error: Amount must be a number above zero");

        BankAccount account = accountRepository.findByAccountNumber(request.accountNumber())
                .orElseThrow(() -> new SecurityException("Error: Invalid account"));

        if (!account.getOwner().getId().equals(user.getId()))
            throw new SecurityException("Error: Invalid account");

        Wallet sourceWallet = account.getWallets().stream()
                .filter(w -> w.getCurrency().equals(request.sourceCurrency()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Error: Not enough funds in " + request.sourceCurrency() + " wallet"));

        if (sourceWallet.getBalance().compareTo(request.amount()) < 0)
            throw new IllegalArgumentException("Error: Not enough funds in " + request.sourceCurrency() + " wallet");

        BigDecimal sourceRate = getNbpRate(request.sourceCurrency());
        BigDecimal targetRate = getNbpRate(request.targetCurrency());

        BigDecimal valueInPln = request.amount().multiply(sourceRate);
        BigDecimal convertedAmount = valueInPln.divide(targetRate, 2, RoundingMode.HALF_UP);

        BigDecimal feePercentage = new BigDecimal("0.02");
        BigDecimal bankFee = convertedAmount.multiply(feePercentage).setScale(2, RoundingMode.HALF_UP);
        BigDecimal finalAmountForUser = convertedAmount.subtract(bankFee);

        Wallet targetWallet = account.getWallets().stream()
                .filter(w -> w.getCurrency().equals(request.targetCurrency()))
                .findFirst().orElse(null);

        if (targetWallet == null)
        {
            targetWallet = new Wallet(request.targetCurrency(), BigDecimal.ZERO, account);
            account.getWallets().add(targetWallet);
        }

        sourceWallet.setBalance(sourceWallet.getBalance().subtract(request.amount()));
        targetWallet.setBalance(targetWallet.getBalance().add(finalAmountForUser));
        accountRepository.save(account);

        String vaultAccountNumber = "PL99999999999999999999999999";
        BankAccount vaultAccount = accountRepository.findByAccountNumber(vaultAccountNumber).orElse(null);

        if (vaultAccount != null)
        {
            Wallet vaultTargetWallet = vaultAccount.getWallets().stream()
                    .filter(w -> w.getCurrency().equals(request.targetCurrency()))
                    .findFirst().orElse(null);

            if (vaultTargetWallet == null)
            {
                vaultTargetWallet = new Wallet(request.targetCurrency(), BigDecimal.ZERO, vaultAccount);
                vaultAccount.getWallets().add(vaultTargetWallet);
            }
            vaultTargetWallet.setBalance(vaultTargetWallet.getBalance().add(bankFee));
            accountRepository.save(vaultAccount);
        }

        Transaction exchangeTx = new Transaction(
                request.accountNumber(),
                request.accountNumber(),
                finalAmountForUser,
                request.targetCurrency(),
                LocalDateTime.now()

        );
        Transaction feeTx = new Transaction(
                request.accountNumber(),
                vaultAccountNumber,
                bankFee,
                request.targetCurrency(),
                LocalDateTime.now()
        );

        transactionRepository.save(exchangeTx);
        transactionRepository.save(feeTx);

        return "Success! Exchanged " + request.amount() + " "
                + request.sourceCurrency() + " to " + finalAmountForUser + " " + request.targetCurrency()
                + " (Bank fee: " + bankFee + " " + request.targetCurrency() + ")";
    }
}
