package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.dto.P2PTransferRequest;
import pl.straczek.portfolio_backend.dto.UserSearchResult;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;
import pl.straczek.portfolio_backend.repository.WalletRepository;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/p2p")
@CrossOrigin(origins = "http://localhost:5173")
public class P2PTransferController
{
    private final AppUserRepository userRepository;
    private final BankAccountRepository bankAccountRepository;
    private final WalletRepository walletRepository;

    // ctor
    public P2PTransferController(AppUserRepository userRepository,
                                 BankAccountRepository bankAccountRepository,
                                 WalletRepository walletRepository)
    {
        this.userRepository = userRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.walletRepository = walletRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResult>> searchUsers(@RequestParam String query, Principal principal)
    {
        // if someone typed in less than two characters, we return an empty list
        if (query == null || query.length() < 2)
            return ResponseEntity.ok(List.of());

        String myEmail = principal.getName();
        List<AppUser> foundUsers = userRepository.searchUsersWithCards(query);

        // we change heavy AppUser objects into light UserSearchResult
        // we also make sure we don't include ourselves in the results
        List<UserSearchResult> results = foundUsers.stream()
                .filter(user -> !user.getEmail().equals(myEmail))
                .map(user -> new UserSearchResult(user.getUsername(), user.getAvatar()))
                .toList();

        return ResponseEntity.ok(results);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> executeP2PTransfer(@RequestBody P2PTransferRequest request, Principal principal)
    {
        // we check the sender and their account
        AppUser sender = userRepository.findByEmail(principal.getName()).orElse(null);
        BankAccount senderAccount = bankAccountRepository
                .findByAccountNumber(request.fromAccountNumber()).orElse(null);

        if (senderAccount == null || !senderAccount.getOwner().equals(sender))
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("This is not your account!");

        if (senderAccount.getPaymentCard() == null)
            return ResponseEntity.badRequest().body("This account doesn't have any connected card!");

        // searching for the first proper wallet
        var senderWallet = senderAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(request.currency()))
                .findFirst()
                .orElse(null);

        if (senderWallet == null || senderWallet.getBalance().compareTo(request.amount()) < 0)
            return ResponseEntity.badRequest().body("Insufficient funds in " + request.currency() + " wallet.");

        // we're looking for the receiver
        AppUser receiver = userRepository.findByUsername(request.targetUsername()).orElse(null);
        if (receiver == null)
            return ResponseEntity.badRequest().body("User not found.");

        BankAccount receiverAccount = bankAccountRepository.findByOwner(receiver).stream()
                .filter(account -> account.getPaymentCard() != null)
                .findFirst()
                .orElse(null);

        if (receiverAccount == null)
            return ResponseEntity.badRequest().body("he receiver does not have a card connected for P2P transfers.");

        // searching for the receiver's wallet of the same currency
        var receiverWallet = receiverAccount.getWallets().stream()
                .filter(w -> w.getCurrency().equals(request.currency()))
                .findFirst()
                .orElse(null);

        if (receiverWallet == null) {
            // TODO: create a new wallet for the receiver
            return ResponseEntity.badRequest().body("The receiver doesn't have a " + request.currency() + " wallet to receive funds.");
        }

        // MONEY TRANSFER
        senderWallet.setBalance(senderWallet.getBalance().subtract(request.amount()));
        receiverWallet.setBalance(receiverWallet.getBalance().add(request.amount()));
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        return ResponseEntity.ok("P2P transfer to " + receiver.getUsername() + " successful!");
    }
}
