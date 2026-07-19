package pl.straczek.portfolio_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Wallet
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String currency; // e.g. "PLN", "EUR", "USD"
    private BigDecimal balance;

    // relationship: many wallets can belong to one bank account
    @ManyToOne
    @JoinColumn(name = "bank_account_id")
    @JsonIgnore // to avoid endless loop of sending JSON to React
    private BankAccount bankAccount;

    // empty ctor
    public Wallet() {}

    // ctor for items
    public Wallet(String currency, BigDecimal balance, BankAccount bankAccount)
    {
        this.currency = currency;
        this.balance = balance;
        this.bankAccount = bankAccount;
    }

    /*
     * Getters
     * */
    public Long getId() { return id; }
    public String getCurrency() { return currency; }
    public BigDecimal getBalance() { return balance; }
    public BankAccount getBankAccount() { return bankAccount; }

    /*
     * Setters
     * */
    public void setCurrency(String currency) { this.currency = currency; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setBankAccount(BankAccount bankAccount) { this.bankAccount = bankAccount; }
}
