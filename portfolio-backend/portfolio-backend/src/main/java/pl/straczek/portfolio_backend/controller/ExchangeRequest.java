package pl.straczek.portfolio_backend.controller;

import java.math.BigDecimal;

public record ExchangeRequest(
        String accountNumber,
        String sourceCurrency,
        String targetCurrency,
        BigDecimal amount
)
{
}
