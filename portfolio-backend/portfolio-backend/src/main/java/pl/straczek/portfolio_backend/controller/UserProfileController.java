package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.repository.AppUserRepository;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController
{
    private final AppUserRepository userRepository;

    // ctor
    public UserProfileController(AppUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    // endpoint to download data
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Principal principal)
    {
        AppUser user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "avatar", user.getAvatar() != null ? user.getAvatar() : ""
        ));
    }

    // endpoint to upload a photo
    @PostMapping("/avatar")
    public ResponseEntity<?> updateAvatar(@RequestBody Map<String, String> request, Principal principal)
    {
        AppUser user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String base64Image = request.get("avatar");
        user.setAvatar(base64Image);
        userRepository.save(user);

        return ResponseEntity.ok("Profile picture updated!");
    }
}
