package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.dto.CreateAccountRequest;
import pl.straczek.portfolio_backend.dto.ExchangeRequest;
import pl.straczek.portfolio_backend.dto.TransferRequest;
import pl.straczek.portfolio_backend.service.BankAccountService;

import java.security.Principal;

@RestController
@RequestMapping("/api/accounts")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "Bearer Authentication") // IMPORTANT
public class BankAccountController
{
    private final BankAccountService bankAccountService;

    // ctor
    public BankAccountController(BankAccountService bankAccountService)
    {
        this.bankAccountService = bankAccountService;
    }

    // opening an account (you get 100 PLN to start)
    @PostMapping("/create")
    public ResponseEntity<String> createAccount(@RequestBody CreateAccountRequest request, Principal principal)
    {
        try
        {
            String response = bankAccountService.createAccount(principal.getName(), request);
            return ResponseEntity.ok(response);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // transferring money
    @PostMapping("/transfer")
    public ResponseEntity<String> transferMoney(@RequestBody TransferRequest request, Principal principal)
    {
        try
        {
            bankAccountService.transferMoney(principal.getName(), request);
            return ResponseEntity.ok("Transfer (" + request.amount() + " " + request.currency() + ") has been sent successfully");

        }
        catch (SecurityException e)
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // getting the history of transactions (therefore GET)
    @GetMapping("/transactions/{accountNumber}")
    public ResponseEntity<?> getTransactionHistory(@PathVariable String accountNumber, Principal principal)
    {
        try
        {
            return ResponseEntity.ok(bankAccountService.getTransactionHistory(principal.getName(), accountNumber));
        }
        catch (SecurityException e)
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAccounts(Principal principal)
    {
        try
        {
            return ResponseEntity.ok(bankAccountService.getMyAccounts(principal.getName()));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }

    @PostMapping("/exchange")
    public ResponseEntity<String> exchangeCurrency(@RequestBody ExchangeRequest request, Principal principal)
    {
        try
        {
            String response = bankAccountService.exchangeCurrency(principal.getName(), request);
            return ResponseEntity.ok(response);

        }
        catch (SecurityException e)
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Could not fetch rates from NBP or process transaction");
        }
    }
}
