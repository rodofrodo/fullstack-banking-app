package pl.straczek.portfolio_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime timestamp;

    // empty constructor
    public Transaction() {}

    // constructor for new items
    public Transaction(String senderAccountNumber,
                       String receiverAccountNumber,
                       BigDecimal amount,
                       String currency,
                       LocalDateTime timestamp)
    {
        this.senderAccountNumber = senderAccountNumber;
        this.receiverAccountNumber = receiverAccountNumber;
        this.amount = amount;
        this.currency = currency;
        this.timestamp = timestamp;
    }

    /*
     * Getters
     * */
    public Long getId() { return id; }
    public String getSenderAccountNumber() { return senderAccountNumber; }
    public String getReceiverAccountNumber() { return receiverAccountNumber; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public LocalDateTime getTimestamp() { return timestamp; }

    /*
     * Setters
     * */
    public void setId(Long id) { this.id = id; }
    public void setSenderAccountNumber(String senderAccountNumber) { this.senderAccountNumber = senderAccountNumber; }
    public void setReceiverAccountNumber(String receiverAccountNumber) { this.receiverAccountNumber = receiverAccountNumber; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
