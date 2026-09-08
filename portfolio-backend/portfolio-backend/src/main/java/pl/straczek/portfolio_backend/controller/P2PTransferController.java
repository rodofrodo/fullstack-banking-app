package pl.straczek.portfolio_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.straczek.portfolio_backend.dto.P2PTransferRequest;
import pl.straczek.portfolio_backend.dto.UserSearchResult;
import pl.straczek.portfolio_backend.service.P2PTransferService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/p2p")
@CrossOrigin(origins = "http://localhost:5173")
public class P2PTransferController
{
    // globals
    private final P2PTransferService transferService;

    // ctor
    public P2PTransferController(P2PTransferService transferService) { this.transferService = transferService; }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResult>> searchUsers(@RequestParam String query, Principal principal)
    {
        List<UserSearchResult> results = transferService.searchUsers(query, principal.getName());
        return ResponseEntity.ok(results);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> executeP2PTransfer(@RequestBody P2PTransferRequest request, Principal principal)
    {
        try {
            transferService.executeTransfer(request, principal.getName());
            return ResponseEntity.ok("P2P transfer to " + request.targetUsername() + " successful!");
        } catch (SecurityException e) {
            if (e.getMessage().equals("Invalid PIN!"))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected server error occurred.");
        }
    }
}
