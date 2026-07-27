package pl.straczek.portfolio_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.model.Wallet;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;
import pl.straczek.portfolio_backend.repository.WalletRepository;

import java.util.List;
import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner
{
    private final AppUserRepository userRepository;
    private final BankAccountRepository accountRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    // ctor
    public DatabaseSeeder(AppUserRepository userRepository,
                          BankAccountRepository accountRepository,
                          WalletRepository walletRepository,
                          PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception
    {
        // we check whether the administrator exists
        Optional<AppUser> adminOpt = userRepository.findByEmail("admin@ancientbank.com");
        AppUser admin;

        if (adminOpt.isEmpty())
        {
            System.out.println("🏛️ Initializing the Ancient Bank Main Vault");
            // creating the admin account
            admin = new AppUser();
            admin.setEmail("admin@ancientbank.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
        }
        else admin = adminOpt.get();

        // we check whether the technical account is created
        String vaultAccountNumber = "PL99999999999999999999999999";
        Optional<BankAccount> accountOpt = accountRepository.findByAccountNumber(vaultAccountNumber);
        BankAccount bankAccount;

        if (accountOpt.isEmpty())
        {
            bankAccount = new BankAccount();
            bankAccount.setAccountNumber(vaultAccountNumber);
            bankAccount.setOwner(admin);
            accountRepository.save(bankAccount);
        }
        else bankAccount = accountOpt.get();

        // we check whether there are wallets with money
        List<Wallet> existingWallets = walletRepository.findAll();
        BankAccount finalVaultAccount = bankAccount; // obligatory for a stream

        boolean hasVaultWallets = existingWallets.stream()
                .anyMatch(w -> w.getBankAccount().getId().equals(finalVaultAccount.getId()));

        if (!hasVaultWallets)
        {
            System.out.println("💰 Airdropping cash to the Vault! Adding millions...");

            Wallet plnWallet = new Wallet();
            plnWallet.setCurrency("PLN");
            plnWallet.setBalance(new java.math.BigDecimal("10000000.00")); // 10M PLN
            plnWallet.setBankAccount(bankAccount);

            Wallet eurWallet = new Wallet();
            eurWallet.setCurrency("EUR");
            eurWallet.setBalance(new java.math.BigDecimal("5000000.00")); // 5M EUR
            eurWallet.setBankAccount(bankAccount);

            Wallet usdWallet = new Wallet();
            usdWallet.setCurrency("USD");
            usdWallet.setBalance(new java.math.BigDecimal("5000000.00")); // 5M USD
            usdWallet.setBankAccount(bankAccount);

            walletRepository.save(plnWallet);
            walletRepository.save(eurWallet);
            walletRepository.save(usdWallet);

            System.out.println("✅ Vault fully funded!");
        }
    }
}
