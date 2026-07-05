package pl.straczek.portfolio_backend.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;

import java.math.BigDecimal;
import java.util.Random;

@RestController
@RequestMapping("/api/accounts")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "Bearer Authentication") // IMPORTANT
public class BankAccountController
{
    private final BankAccountRepository accountRepository;
    private final AppUserRepository userRepository;

    // ctor
    public BankAccountController(BankAccountRepository accountRepository,
                                 AppUserRepository userRepository)
    {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
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
        BankAccount account = new BankAccount(accountNumber, new BigDecimal("100.00"), user);
        accountRepository.save(account);

        return "Created an account for " + user.getUsername() + ". Account number: " + accountNumber + " | Balance: 100 PLN";
    }

    // transferring money
    @PostMapping("/transfer")
    @Transactional
    public String transferMoney(@RequestBody TransferRequest request)
    {
        AppUser user = getLoggedInUser();

        // we're looking for a sender
        BankAccount senderAccount = accountRepository
                .findByAccountNumber(request.fromAccountNumber())
                .orElse(null);

        if (senderAccount == null)
            return "Error: You don't have a bank account";
        if (!senderAccount.getOwner().getId().equals(user.getId()))
            return "Error: You don't have permission to send money from this account";
        if (senderAccount.getBalance().compareTo(request.amount()) < 0)
            return "Error: Too little money on your account";
        if (request.amount().compareTo(BigDecimal.ZERO) <= 0)
            return "Error: Amount must be a number above zero";

        // we're looking for a receiver
        BankAccount receiverAccount = accountRepository
                .findByAccountNumber(request.toAccountNumber())
                .orElse(null);

        if (receiverAccount == null)
            return "Error: The receiver account doesn't exist";

        // we subtract from the sender and add to the receiver
        senderAccount.setBalance(senderAccount.getBalance().subtract(request.amount()));
        receiverAccount.setBalance(receiverAccount.getBalance().add(request.amount()));

        // saving changes to the database
        accountRepository.save(senderAccount);
        accountRepository.save(receiverAccount);

        return "Transfer (" + request.amount() + " PLN) has been sent successfully";
    }
}
