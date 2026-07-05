package pl.straczek.portfolio_backend.controller;

import java.math.BigDecimal;

public record TransferRequest(String fromAccountNumber, String toAccountNumber, BigDecimal amount)
{
}
