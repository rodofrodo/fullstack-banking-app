package pl.straczek.portfolio_backend.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.repository.AppUserRepository;
import pl.straczek.portfolio_backend.service.JwtService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "Bearer Authentication") // IMPORTANT
public class AppUserController
{
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // dependency injection
    public AppUserController(AppUserRepository userRepository,
                             PasswordEncoder passwordEncoder,
                             JwtService jwtService)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // endpoint to download all the users (GET https://localhost:8080/api/users)
    @GetMapping
    public List<AppUser> getAllUsers() { return userRepository.findAll(); }

    // endpoint to register a user (POST https://localhost:8080/api/users)
    @PostMapping
    public String registerUser(@RequestBody AppUser user)
    {
        if (userRepository.existsByEmail(user.getEmail()))
            return "Error: this email is currently in use";

        // hashing user's password
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        userRepository.save(user);
        return "Success: User " + user.getUsername() + " has been successfully registered!";
    }

    // endpoint to log in (POST https://localhost:8080/api/users/login)
    @PostMapping("/login")
    public String loginUser(@RequestBody AppUser loginRequest)
    {
        // we're looking for a user in database by email address
        Optional<AppUser> userOptional = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(loginRequest.getEmail()))
                .findFirst();
        if (userOptional.isEmpty())
            return "Error: there is no user with such an email!";

        AppUser user = userOptional.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            return "Error: wrong password!";

        return jwtService.generateToken(user);
    }
}
