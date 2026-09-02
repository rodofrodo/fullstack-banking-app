package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.straczek.portfolio_backend.model.BankAccount;
import pl.straczek.portfolio_backend.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>
{
    // Spring Data JPA will type in the SQL inquiry
    List<Transaction> findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc
        (String senderAccount, String receiverAccount);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.senderAccountNumber = :accountNumber AND t.timestamp BETWEEN :startOfDay AND :endOfDay")
    BigDecimal sumDailySpentAmount(@Param("accountNumber") String accountNumber,
                                   @Param("startOfDay") LocalDateTime startOfDay,
                                   @Param("endOfDay") LocalDateTime endOfDay);
}
