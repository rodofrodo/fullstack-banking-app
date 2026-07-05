package pl.straczek.portfolio_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bank_accounts")
public class BankAccount
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private BigDecimal balance;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser owner;

    // empty constructor
    public BankAccount() {}

    // constructor for new bank accounts
    public BankAccount(String accountNumber, BigDecimal balance, AppUser owner)
    {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.owner = owner;
    }

    /*
     * Getters
     * */
    public Long getId() { return id; }
    public String getAccountNumber() { return accountNumber; }
    public BigDecimal getBalance() { return balance; }
    public AppUser getOwner() { return owner; }

    /*
     * Setters
     * */
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setOwner(AppUser owner) { this.owner = owner; }
}
