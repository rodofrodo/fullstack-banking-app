package pl.straczek.portfolio_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class PaymentCard
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 16)
    private String cardNumber;

    private String expirationDate; // e.g. "12/28"
    private String cvv;            // e.g. "123"
    private boolean isFrozen = false;

    // relation: one card belongs to one account
    @OneToOne
    @JoinColumn(name = "bank_account_id", unique = true)
    @JsonIgnore
    private BankAccount bankAccount;

    // empty ctor
    public PaymentCard() {}

    // ctor for new items
    public PaymentCard(String cardNumber,
                       String expirationDate,
                       String cvv,
                       BankAccount bankAccount)
    {
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
        this.bankAccount = bankAccount;
    }

    /*
     * Getters
     * */
    public Long getId() { return id; }
    public String getCardNumber() { return cardNumber; }
    public String getExpirationDate() { return expirationDate; }
    public String getCvv() { return cvv; }
    public BankAccount getBankAccount() { return bankAccount; }
    public boolean isFrozen() { return isFrozen; }

    /*
     * Setters
     * */
    public void setFrozen(boolean frozen) { isFrozen = frozen; }
}
