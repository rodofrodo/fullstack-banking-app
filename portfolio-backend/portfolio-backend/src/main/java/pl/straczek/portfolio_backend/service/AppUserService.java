package pl.straczek.portfolio_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.repository.AppUserRepository;

import java.util.List;

@Service
public class AppUserService
{
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AppUserService(AppUserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public List<AppUser> getAllUsers() { return userRepository.findAll(); }

    @Transactional
    public String registerUser(AppUser user)
    {
        if (userRepository.existsByEmail(user.getEmail()))
            throw new IllegalArgumentException("Error: this email is currently in use");

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);

        return "Success: User " + user.getUsername() + " has been successfully registered!";
    }

    public String loginUser(AppUser loginRequest)
    {
        AppUser user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new SecurityException("Error: there is no user with such an email!"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            throw new SecurityException("Error: wrong password!");

        return jwtService.generateToken(user);
    }
}
