package pl.straczek.portfolio_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class AppUser
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;

    // empty constructor
    public AppUser() {}

    // constructor for new items
    public AppUser(String username, String email, String password)
    {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    /*
    * Getters
    * */
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    /*
    * Setters
    * */
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
