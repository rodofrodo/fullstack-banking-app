package pl.straczek.portfolio_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.repository.AppUserRepository;

import java.util.Map;

@Service
public class UserProfileService
{
    private final AppUserRepository userRepository;

    public UserProfileService(AppUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public Map<String, String> getUserProfile(String email)
    {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new SecurityException("User not found"));

        return Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "avatar", user.getAvatar() != null ? user.getAvatar() : ""
        );
    }

    @Transactional
    public void updateAvatar(String email, String base64Image)
    {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new SecurityException("User not found"));

        user.setAvatar(base64Image);
        userRepository.save(user);
    }
}
