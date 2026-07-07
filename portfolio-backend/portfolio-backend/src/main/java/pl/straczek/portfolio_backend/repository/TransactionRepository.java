package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straczek.portfolio_backend.model.Transaction;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>
{
    // Spring Data JPA will type in the SQL inquiry
    List<Transaction> findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc
        (String senderAccount, String receiverAccount);
}
