package pl.straczek.portfolio_backend.dto;

import java.math.BigDecimal;

public record TransferRequest(
        String fromAccountNumber,
        String toAccountNumber,
        BigDecimal amount,
        String currency)
{
}
