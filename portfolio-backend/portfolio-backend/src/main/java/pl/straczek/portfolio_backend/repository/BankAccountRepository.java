package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.model.BankAccount;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long>
{
    // this method will find an account by its number automatically
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    // it's going to be "SELECT * FROM bank_account WHERE owner_id = ?"
    List<BankAccount> findByOwner(AppUser owner);
    List<BankAccount> findAllByOwner(AppUser user);
}
