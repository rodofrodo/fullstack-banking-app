package pl.straczek.portfolio_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.straczek.portfolio_backend.model.AppUser;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long>
{
    // for Spring Boot
    boolean existsByEmail(String email);
    // this will allow to filter the database faster
    Optional<AppUser> findByEmail(String email);
}
