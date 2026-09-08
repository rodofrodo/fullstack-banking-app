package pl.straczek.portfolio_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CurrencyService
{
    // globals
    private final RestTemplate restTemplate;

    // ctor
    public CurrencyService() { this.restTemplate = new RestTemplate(); }

    // retrieves current values of currencies
    public String getLiveRates()
    {
        String nbpApiUrl = "http://api.nbp.pl/api/exchangerates/tables/A?format=json";
        return restTemplate.getForObject(nbpApiUrl, String.class);
    }
}
