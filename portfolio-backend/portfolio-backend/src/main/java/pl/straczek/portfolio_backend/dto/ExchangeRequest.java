package pl.straczek.portfolio_backend.dto;

import java.math.BigDecimal;

public record ExchangeRequest(
        String accountNumber,
        String sourceCurrency,
        String targetCurrency,
        BigDecimal amount
)
{
}
