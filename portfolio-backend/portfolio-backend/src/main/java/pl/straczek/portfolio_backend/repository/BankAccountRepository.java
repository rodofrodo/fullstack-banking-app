package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straczek.portfolio_backend.model.BankAccount;

import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long>
{
    // this method will find an account by its number automatically
    Optional<BankAccount> findByAccountNumber(String accountNumber);
}
