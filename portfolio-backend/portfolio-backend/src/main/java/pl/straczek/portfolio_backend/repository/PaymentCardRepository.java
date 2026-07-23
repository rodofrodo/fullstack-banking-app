package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.straczek.portfolio_backend.model.PaymentCard;
import java.util.Optional;

public interface PaymentCardRepository extends JpaRepository<PaymentCard, Long>
{
    // bla bla
    Optional<PaymentCard> findByCardNumber(String cardNumber);
}
