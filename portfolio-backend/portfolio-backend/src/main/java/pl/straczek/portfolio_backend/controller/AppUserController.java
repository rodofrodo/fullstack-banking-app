package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.service.AppUserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "Bearer Authentication") // IMPORTANT
public class AppUserController
{
    // globals
    private final AppUserService appUserService;

    // ctor
    public AppUserController(AppUserService appUserService) { this.appUserService = appUserService; }

    @GetMapping
    public List<AppUser> getAllUsers() { return appUserService.getAllUsers(); }

    @PostMapping
    public ResponseEntity<String> registerUser(@RequestBody AppUser user)
    {
        try {
            String successMessage = appUserService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(successMessage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody AppUser loginRequest)
    {
        try {
            String token = appUserService.loginUser(loginRequest);
            return ResponseEntity.ok(token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
