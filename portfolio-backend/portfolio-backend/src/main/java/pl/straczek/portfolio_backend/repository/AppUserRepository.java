package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straczek.portfolio_backend.model.AppUser;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long>
{
    // for Spring Boot
    boolean existsByEmail(String email);
}
