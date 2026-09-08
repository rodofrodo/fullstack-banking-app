package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.service.UserProfileService;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController
{
    // globals
    private final UserProfileService userProfileService;

    // ctor
    public UserProfileController(UserProfileService userProfileService) { this.userProfileService = userProfileService; }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Principal principal)
    {
        try {
            Map<String, String> profileData = userProfileService.getUserProfile(principal.getName());
            return ResponseEntity.ok(profileData);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> updateAvatar(@RequestBody Map<String, String> request, Principal principal)
    {
        try {
            userProfileService.updateAvatar(principal.getName(), request.get("avatar"));
            return ResponseEntity.ok("Profile picture updated!");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
