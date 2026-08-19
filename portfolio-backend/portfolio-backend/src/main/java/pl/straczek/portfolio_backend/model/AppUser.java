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
    private String role = "ROLE_USER";

    @Column(columnDefinition = "TEXT")
    private String avatar;

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
    public String getRole() { return role; }
    public String getAvatar() { return avatar; }

    /*
    * Setters
    * */
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
