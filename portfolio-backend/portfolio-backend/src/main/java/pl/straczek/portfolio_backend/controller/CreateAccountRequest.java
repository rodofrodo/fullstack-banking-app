package pl.straczek.portfolio_backend.controller;

public record CreateAccountRequest(
        String accountType,
        boolean isMultiCurrency,
        String baseCurrency
)
{
}
