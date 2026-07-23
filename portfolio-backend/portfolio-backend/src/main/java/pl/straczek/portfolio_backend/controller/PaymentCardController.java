package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.model.PaymentCard;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;
import pl.straczek.portfolio_backend.repository.PaymentCardRepository;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.service.CardGeneratorService;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentCardController
{
    private final BankAccountRepository accountRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final AppUserRepository userRepository;
    private final CardGeneratorService cardGeneratorService;

    public PaymentCardController(BankAccountRepository accountRepository,
                                 PaymentCardRepository paymentCardRepository,
                                 AppUserRepository userRepository,
                                 CardGeneratorService cardGeneratorService)
    {
        this.accountRepository = accountRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.userRepository = userRepository;
        this.cardGeneratorService = cardGeneratorService;
    }

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<String> orderNewCard(@RequestBody Map<String, String> request, Principal principal)
    {
        try
        {
            // account number from the map
            String requestedAccountNumber = request.get("accountNumber");

            // we check who's logged in
            AppUser user = userRepository.findByEmail(principal.getName()).orElse(null);
            if (user == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            // searching for the bank account the card will be assigned to
            BankAccount targetAccount = accountRepository.findByAccountNumber(requestedAccountNumber).orElse(null);
            if (targetAccount == null || !targetAccount.getOwner().getId().equals(user.getId()))
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body("Error: Invalid account");

            // checking if any account has a card assigned
            List<BankAccount> userAccounts = accountRepository.findAllByOwner(user);
            boolean hasCardAlready = userAccounts.stream()
                    .anyMatch(acc -> acc.getPaymentCard() != null);
            if (hasCardAlready)
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Error: You already have a debit card issued to one of your accounts.");

            // generating the  card
            String cardNumber = cardGeneratorService.generateMastercardNumber();
            String cvv = cardGeneratorService.generateCvv();
            String expDate = cardGeneratorService.generateExpirationDate();

            // saving the card and assigning it to the target account
            PaymentCard newCard = new PaymentCard(cardNumber, expDate, cvv, targetAccount);
            targetAccount.setPaymentCard(newCard);

            paymentCardRepository.save(newCard);
            accountRepository.save(targetAccount);

            return ResponseEntity.ok("Success! Your new Mastercard has been issued.");
        }
        catch (Exception e)
        {
            // for tests
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Crash: " + e.getMessage());
        }
    }
}
