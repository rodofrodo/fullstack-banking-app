package pl.straczek.portfolio_backend.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class CardGeneratorService
{
    private final Random random = new Random();

    // generating 16-digit number according to Luhn algorithm
    public String generateMastercardNumber()
    {
        StringBuilder card = new StringBuilder("54"); // Mastercard 51-55
        for (int i = 0; i < 13; i++)
            card.append(random.nextInt(10));
        int checkDigit = calculateLuhnCheckDigit(card.toString());
        card.append(checkDigit);
        return card.toString();
    }

    // control digit (Luhn)
    private int calculateLuhnCheckDigit(String number)
    {
        int sum = 0;
        boolean alternate = true;
        for (int i = number.length() - 1; i >= 0; i--)
        {
            int n = Integer.parseInt(number.substring(i, i + 1));
            if (alternate)
            {
                n *= 2;
                if (n > 9)
                    n = (n % 10) + 1;
            }
            sum += n;
            alternate = !alternate;
        }
        return (10 - (sum % 10)) % 10;
    }

    // 3-digit CVV code
    public String generateCvv() { return String.format("%03d", random.nextInt(1000)); }

    // generating expiration date
    public String generateExpirationDate()
    {
        LocalDate expiryDate = LocalDate.now().plusYears(4);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
        return expiryDate.format(formatter);
    }
}
