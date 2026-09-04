package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.service.PaymentCardService;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentCardController
{
    private final PaymentCardService paymentCardService;

    public PaymentCardController(PaymentCardService paymentCardService)
    {
        this.paymentCardService = paymentCardService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> orderNewCard(@RequestBody Map<String, String> request, Principal principal)
    {
        try
        {
            String accountNumber = request.get("accountNumber");
            String pin = request.get("pin");
            String dailyLimit = request.get("dailyLimit");

            paymentCardService.orderNewCard(principal.getName(), accountNumber, pin, dailyLimit);

            return ResponseEntity.ok("Success! Your new Mastercard has been issued.");
        }
        catch (SecurityException e)
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Crash: " + e.getMessage());
        }
    }
}
