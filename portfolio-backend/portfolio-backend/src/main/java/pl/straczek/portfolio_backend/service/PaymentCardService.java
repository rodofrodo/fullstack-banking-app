package pl.straczek.portfolio_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.model.PaymentCard;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;
import pl.straczek.portfolio_backend.repository.PaymentCardRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PaymentCardService
{
    // globals
    private final BankAccountRepository accountRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final AppUserRepository userRepository;
    private final CardGeneratorService cardGeneratorService;

    // ctor
    public PaymentCardService(BankAccountRepository accountRepository,
                                 PaymentCardRepository paymentCardRepository,
                                 AppUserRepository userRepository,
                                 CardGeneratorService cardGeneratorService)
    {
        this.accountRepository = accountRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.userRepository = userRepository;
        this.cardGeneratorService = cardGeneratorService;
    }

    // orders a new debit card
    @Transactional
    public void orderNewCard(String email, String requestedAccountNumber, String pin, String dailyLimitStr)
    {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new SecurityException("Error: Unauthorized user"));

        BankAccount targetAccount = accountRepository.findByAccountNumber(requestedAccountNumber)
                .orElseThrow(() -> new SecurityException("Error: Invalid account"));

        if (!targetAccount.getOwner().getId().equals(user.getId()))
            throw new SecurityException("Error: Invalid account");

        if (targetAccount.getAccountType() != null &&
                (!targetAccount.getAccountType().equals("PERSONAL") &&
                !targetAccount.getAccountType().equals("BUSINESS")))
            throw new IllegalArgumentException("Error: Cards can only be issued for Personal or Business accounts.");

        List<BankAccount> userAccounts = accountRepository.findAllByOwner(user);
        boolean hasCardAlready = userAccounts.stream()
                .anyMatch(acc -> acc.getPaymentCard() != null);
        if (hasCardAlready)
            throw new IllegalArgumentException("Error: You already have a debit card issued to one of your accounts.");

        String cardNumber = cardGeneratorService.generateMastercardNumber();
        String cvv = cardGeneratorService.generateCvv();
        String expDate = cardGeneratorService.generateExpirationDate();

        PaymentCard newCard = new PaymentCard(cardNumber, expDate, cvv, targetAccount);
        targetAccount.setPaymentCard(newCard);

        newCard.setPin(pin);
        newCard.setDailyLimit(new BigDecimal(dailyLimitStr));
        newCard.setFrozen(false);

        paymentCardRepository.save(newCard);
        accountRepository.save(targetAccount);
    }
}
