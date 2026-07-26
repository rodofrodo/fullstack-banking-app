package pl.straczek.portfolio_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.repository.BankAccountRepository;

import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner
{
    private final AppUserRepository userRepository;
    private final BankAccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    // ctor
    public DatabaseSeeder(AppUserRepository userRepository,
                          BankAccountRepository accountRepository,
                          PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception
    {
        // we check whether the administrator exists
        Optional<AppUser> adminOpt = userRepository.findByEmail("admin@ancientbank.com");

        if (adminOpt.isEmpty())
        {
            System.out.println("🏛️ Initializing the Ancient Bank Main Vault");

            // creating the admin account
            AppUser admin = new AppUser();
            admin.setEmail("admin@ancientbank.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);

            // creating a technical bank account
            String vaultAccountNumber = "PL99999999999999999999999999";
            BankAccount vaultAccount = new BankAccount();
            vaultAccount.setAccountNumber(vaultAccountNumber);
            vaultAccount.setOwner(admin);
            accountRepository.save(vaultAccount);
        }
    }
}
