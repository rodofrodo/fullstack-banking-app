package pl.straczek.portfolio_backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bank_accounts")
public class BankAccount
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @OneToMany(mappedBy = "bankAccount", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Wallet> wallets = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser owner;

    @OneToOne(mappedBy = "bankAccount", cascade = CascadeType.ALL)
    private PaymentCard paymentCard;

    // empty constructor
    public BankAccount() {}

    // constructor for new bank accounts
    public BankAccount(String accountNumber, AppUser owner)
    {
        this.accountNumber = accountNumber;
        this.owner = owner;
    }

    /*
     * Getters
     * */
    public Long getId() { return id; }
    public String getAccountNumber() { return accountNumber; }
    public List<Wallet> getWallets() { return wallets; }
    public AppUser getOwner() { return owner; }
    public PaymentCard getPaymentCard() { return paymentCard; }

    /*
     * Setters
     * */
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public void setWallets(List<Wallet> wallets) { this.wallets = wallets; }
    public void setOwner(AppUser owner) { this.owner = owner; }
    public void setPaymentCard(PaymentCard paymentCard) { this.paymentCard = paymentCard; }
}
