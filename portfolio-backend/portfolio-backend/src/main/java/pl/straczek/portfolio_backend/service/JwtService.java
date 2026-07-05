package pl.straczek.portfolio_backend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Service;
import pl.straczek.portfolio_backend.model.AppUser;

import java.util.Date;

@Service
public class JwtService
{
    // this key should be hidden in environment variables
    private final String SECRET_KEY = "MojBardzoNiewiarygodnieBezpiecznyIKompaktowyKluczTajny123!";

    public String generateToken(AppUser user)
    {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
        return JWT.create()
                .withSubject(user.getEmail()) // main identifier (email)
                .withClaim("username", user.getUsername()) // additional data
                .withIssuedAt(new Date()) // issue date
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .sign(algorithm); // signature with a secret key
    }

    public String extractEmail(String token)
    {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
        return JWT.require(algorithm)
                .build()
                .verify(token) // if a token is forged or expired
                .getSubject(); // email
    }
}
