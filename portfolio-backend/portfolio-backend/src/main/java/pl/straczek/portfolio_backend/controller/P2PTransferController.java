package pl.straczek.portfolio_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.dto.UserSearchResult;
import pl.straczek.portfolio_backend.model.AppUser;
import pl.straczek.portfolio_backend.repository.AppUserRepository;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/p2p")
@CrossOrigin(origins = "http://localhost:5173")
public class P2PTransferController
{
    private final AppUserRepository userRepository;

    // ctor
    public P2PTransferController(AppUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResult>> searchUsers(@RequestParam String query, Principal principal)
    {
        // if someone typed in less than two characters, we return an empty list
        if (query == null || query.length() < 2)
            return ResponseEntity.ok(List.of());

        String myEmail = principal.getName();
        List<AppUser> foundUsers = userRepository.searchUsersWithCards(query);

        // we change heavy AppUser objects into light UserSearchResult
        // we also make sure we don't include ourselves in the results
        List<UserSearchResult> results = foundUsers.stream()
                .filter(user -> !user.getEmail().equals(myEmail))
                .map(user -> new UserSearchResult(user.getUsername(), user.getAvatar()))
                .toList();

        return ResponseEntity.ok(results);
    }
}
