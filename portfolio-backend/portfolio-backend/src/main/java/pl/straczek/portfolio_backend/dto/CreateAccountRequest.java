package pl.straczek.portfolio_backend.dto;

public record CreateAccountRequest(
        String accountType,
        boolean isMultiCurrency,
        String baseCurrency
)
{
}
