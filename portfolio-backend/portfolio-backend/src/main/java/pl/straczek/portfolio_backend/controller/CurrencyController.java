package pl.straczek.portfolio_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.straczek.portfolio_backend.service.CurrencyService;

@RestController
@RequestMapping("/api/currency")
public class CurrencyController
{
    // globals
    private final CurrencyService currencyService;

    // ctor
    public CurrencyController(CurrencyService currencyService) { this.currencyService = currencyService; }

    @GetMapping("/rates")
    public ResponseEntity<String> getLiveRates()
    {
        try {
            String rates = currencyService.getLiveRates();
            return ResponseEntity.ok(rates);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: Unable to fetch live rates from NBP at this time.");
        }
    }
}
