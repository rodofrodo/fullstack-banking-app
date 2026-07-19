package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straczek.portfolio_backend.model.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long>
{
}
