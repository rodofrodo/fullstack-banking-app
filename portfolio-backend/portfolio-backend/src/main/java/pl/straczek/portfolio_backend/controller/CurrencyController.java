package pl.straczek.portfolio_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/currency")
public class CurrencyController
{
    // endpoint to get current values of currencies (GET https://localhost:8080/api/currency/rates)
    @GetMapping("/rates")
    public String getLiveRates()
    {
        RestTemplate restTemplate = new RestTemplate();

        // API NBP (National Bank of Poland) - Table A in JSON
        String nbpApiUrl = "http://api.nbp.pl/api/exchangerates/tables/A?format=json";
        return restTemplate.getForObject(nbpApiUrl, String.class);
    }
}
