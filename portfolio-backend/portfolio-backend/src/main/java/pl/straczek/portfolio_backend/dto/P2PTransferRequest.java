package pl.straczek.portfolio_backend.dto;

import java.math.BigDecimal;

public record P2PTransferRequest(
        String fromAccountNumber, // sender (has to have a card)
        String targetUsername,    // our friend from the search engine
        BigDecimal amount,        // the amount we send
        String currency           // e.g. PLN
)
{
}
