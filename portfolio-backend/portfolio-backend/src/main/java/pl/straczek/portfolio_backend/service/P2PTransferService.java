package pl.straczek.portfolio_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.straczek.portfolio_backend.dto.P2PTransferRequest;
import pl.straczek.portfolio_backend.dto.UserSearchResult;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.model.Transaction;
import pl.straczek.portfolio_backend.model.Wallet;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;
import pl.straczek.portfolio_backend.repository.TransactionRepository;
import pl.straczek.portfolio_backend.repository.WalletRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class P2PTransferService
{
    private final AppUserRepository userRepository;
    private final BankAccountRepository bankAccountRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public P2PTransferService(AppUserRepository userRepository,
                                 BankAccountRepository bankAccountRepository,
                                 WalletRepository walletRepository,
                                 TransactionRepository transactionRepository)
    {
        this.userRepository = userRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<UserSearchResult> searchUsers(String query, String myEmail)
    {
        if (query == null || query.length() < 2)
            return List.of();

        return userRepository.searchUsersWithCards(query).stream()
                .filter(user -> !user.getEmail().equals(myEmail))
                .map(user -> new UserSearchResult(user.getUsername(), user.getAvatar()))
                .toList();
    }

    @Transactional
    public void executeTransfer(P2PTransferRequest request, String senderEmail)
    {
        AppUser sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new SecurityException("User not found!"));

        BankAccount senderAccount = bankAccountRepository.findByAccountNumber(request.fromAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Account not found!"));

        if (!senderAccount.getOwner().equals(sender))
            throw new SecurityException("This is not your account!");

        if (senderAccount.getPaymentCard() == null)
            throw new IllegalArgumentException("This account doesn't have any connected card!");

        var card = senderAccount.getPaymentCard();
        if (!card.getPin().equals(request.pin()))
            throw new SecurityException("Invalid PIN!");

        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);
        BigDecimal spentToday = transactionRepository.sumDailySpentAmount(senderAccount.getAccountNumber(), startOfDay, endOfDay);

        if (spentToday.add(request.amount()).compareTo(card.getDailyLimit()) > 0)
            throw new IllegalArgumentException("You have already exceeded the limit: " + spentToday + " " + request.currency());

        var senderWallet = senderAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(request.currency()))
                .findFirst()
                .orElse(null);
        if (senderWallet == null || senderWallet.getBalance().compareTo(request.amount()) < 0)
            throw new IllegalArgumentException("Insufficient funds in " + request.currency() + " wallet.");

        AppUser receiver = userRepository.findByUsername(request.targetUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        BankAccount receiverAccount = bankAccountRepository.findByOwner(receiver).stream()
                .filter(account -> account.getPaymentCard() != null)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("The receiver does not have a card connected for P2P transfers."));

        var receiverWallet = receiverAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(request.currency()))
                .findFirst()
                .orElse(null);

        if (receiverWallet == null) {
            receiverWallet = new Wallet();
            receiverWallet.setCurrency(request.currency());
            receiverWallet.setBalance(BigDecimal.ZERO);
            receiverWallet.setBankAccount(receiverAccount);
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(request.amount()));
        receiverWallet.setBalance(receiverWallet.getBalance().add(request.amount()));
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Transaction transaction = new Transaction(
                senderAccount.getAccountNumber(),
                receiverAccount.getAccountNumber(),
                request.amount(),
                request.currency(),
                LocalDateTime.now()
        );
        transactionRepository.save(transaction);
    }
}
