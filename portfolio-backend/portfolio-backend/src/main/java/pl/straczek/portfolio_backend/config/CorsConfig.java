package pl.straczek.portfolio_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer
{
    @Override
    public void addCorsMappings(CorsRegistry registry)
    {
        registry.addMapping("/**") // access to all of our endpoints (/api/...)
                .allowedOrigins("http://localhost:5173") // React.js
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // operations
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
