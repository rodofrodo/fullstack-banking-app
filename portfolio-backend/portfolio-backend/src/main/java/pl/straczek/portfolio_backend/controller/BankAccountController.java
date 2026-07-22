package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
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
import java.util.Random;

@RestController
@RequestMapping("/api/accounts")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "Bearer Authentication") // IMPORTANT
public class BankAccountController
{
    private final BankAccountRepository accountRepository;
    private final AppUserRepository userRepository;
    private final TransactionRepository transactionRepository;

    // ctor
    public BankAccountController(BankAccountRepository accountRepository,
                                 AppUserRepository userRepository,
                                 TransactionRepository transactionRepository)
    {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // identification method (JWT-based)
    private AppUser getLoggedInUser()
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cannot find such a user"));
    }

    // opening an account (you get 100 PLN to start)
    @PostMapping("/create")
    public String createAccount()
    {
        AppUser user = getLoggedInUser();

        // generating random 26-digit bank account number
        String accountNumber = "PL" + (100000000000000000L + (long)(new Random().nextDouble() * 900000000000000000L));

        BankAccount account = new BankAccount(accountNumber, user);
        Wallet defaultPlnWallet = new Wallet("PLN", new BigDecimal("100.00"), account);
        account.getWallets().add(defaultPlnWallet);
        accountRepository.save(account);

        return "Created an account for " + user.getUsername() + ". Account number: " + accountNumber + " | Balance: 100 PLN";
    }

    // transferring money
    @PostMapping("/transfer")
    @Transactional
    public ResponseEntity<String> transferMoney(@RequestBody TransferRequest request)
    {
        AppUser user = getLoggedInUser();
        String transferCurrency = request.currency();

        // we're looking for a sender
        BankAccount senderAccount = accountRepository
                .findByAccountNumber(request.fromAccountNumber())
                .orElse(null);

        if (senderAccount == null)
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Error: You don't have a bank account");

        if (!senderAccount.getOwner().getId().equals(user.getId()))
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Error: You don't have permission to send money from this account");

        Wallet senderWallet = senderAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(transferCurrency))
                .findFirst()
                .orElse(null);

        if (senderWallet == null)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: You don't have a " + transferCurrency + " wallet to send money from.");

        if (senderWallet.getBalance().compareTo(request.amount()) < 0)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Too little money");

        if (request.amount().compareTo(BigDecimal.ZERO) <= 0)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Amount must be a number above zero");

        // we're looking for a receiver
        BankAccount receiverAccount = accountRepository
                .findByAccountNumber(request.toAccountNumber())
                .orElse(null);

        if (receiverAccount == null)
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Error: The receiver account doesn't exist");

        Wallet receiverWallet = receiverAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(transferCurrency))
                .findFirst()
                .orElse(null);

        if (receiverWallet == null)
        {
            receiverWallet = new Wallet(transferCurrency, BigDecimal.ZERO, receiverAccount);
            receiverAccount.getWallets().add(receiverWallet);
        }

        // we subtract from the sender and add to the receiver
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
                java.time.LocalDateTime.now()
        );
        transactionRepository.save(transaction);

        return ResponseEntity.ok("Transfer (" + request.amount() + " " + transferCurrency + ") has been sent successfully");
    }

    // getting the history of transactions (therefore GET)
    @GetMapping("/transactions/{accountNumber}")
    public Object getTransactionHistory(@PathVariable String accountNumber)
    {
        AppUser user = getLoggedInUser();

        // checking if such an account exists
        BankAccount account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null)
            return "Error: This account doesn't exist";
        // we make sure the user requests his own account history
        if (!account.getOwner().getId().equals(user.getId()))
            return "Error: You don't have permission to browse this account history";

        // returning the list of transactions
        return transactionRepository.findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc(accountNumber, accountNumber);
    }

    @GetMapping("/my")
    public Object getMyAccounts()
    {
        AppUser user = getLoggedInUser();
        return accountRepository.findByOwner(user);
    }

    // this method helps retrieve an exchange rate
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

    @PostMapping("/exchange")
    @Transactional
    public ResponseEntity<String> exchangeCurrency(@RequestBody ExchangeRequest request)
    {
        AppUser user = getLoggedInUser();

        // basic security
        if (request.sourceCurrency().equals(request.targetCurrency()))
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Source and target currencies must be different");

        if (request.amount().compareTo(BigDecimal.ZERO) <= 0)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Amount must be a number above zero");

        BankAccount account = accountRepository
                .findByAccountNumber(request.accountNumber())
                .orElse(null);

        if (account == null || !account.getOwner().getId().equals(user.getId()))
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Error: Invalid account");

        // we check the source wallet and its balance
        Wallet sourceWallet = account.getWallets().stream()
                .filter(w -> w.getCurrency().equals(request.sourceCurrency()))
                .findFirst().orElse(null);

        if (sourceWallet == null || sourceWallet.getBalance().compareTo(request.amount()) < 0)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Not enough funds in " + request.sourceCurrency() + " wallet");

        try
        {
            // getting the exchange rates
            BigDecimal sourceRate = getNbpRate(request.sourceCurrency());
            BigDecimal targetRate = getNbpRate(request.targetCurrency());

            // we convert to PLN and then to the target currency
            BigDecimal valueInPln = request.amount().multiply(sourceRate);
            BigDecimal convertedAmount = valueInPln.divide(targetRate, 2, RoundingMode.HALF_UP);

            Wallet targetWallet = account.getWallets().stream()
                    .filter(w -> w.getCurrency().equals(request.targetCurrency()))
                    .findFirst().orElse(null);

            if (targetWallet == null)
            {
                targetWallet = new Wallet(request.targetCurrency(), BigDecimal.ZERO, account);
                account.getWallets().add(targetWallet);
            }

            sourceWallet.setBalance(sourceWallet.getBalance().subtract(request.amount()));
            targetWallet.setBalance(targetWallet.getBalance().add(convertedAmount));
            accountRepository.save(account);

            return ResponseEntity.ok("Success! Exchanged " + request.amount() + " "
                    + request.sourceCurrency() + " to " + convertedAmount + " " + request.targetCurrency());
        }
        catch (Exception e)
        {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: Could not fetch rates from NBP");
        }
    }
}
