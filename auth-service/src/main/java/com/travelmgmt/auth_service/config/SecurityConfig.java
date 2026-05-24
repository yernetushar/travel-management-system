package com.travelmgmt.auth_service.config;

import com.travelmgmt.auth_service.model.User;
import com.travelmgmt.auth_service.repository.UserRepository;
import com.travelmgmt.auth_service.service.CustomOAuth2UserService;
import com.travelmgmt.auth_service.service.JwtService;
import com.travelmgmt.auth_service.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final UserService userService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                          UserService userService,
                          JwtService jwtService,
                          UserRepository userRepository) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ NOT disabled
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(user -> user
                    .userService(customOAuth2UserService)
                )
                .successHandler((request, response, authentication) -> {
                    System.out.println("=== SUCCESS HANDLER ===");
                    OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
                    String email = oauthUser.getAttribute("email");
                    String name  = oauthUser.getAttribute("name");
                    userService.saveOAuthUser(email, name);
                    User user = userRepository.findByEmail(email).orElseThrow();
                    String token = jwtService.generateToken(user);
                    String redirectUrl = "http://localhost:5173/oauth-success?token=" + token;
                    System.out.println("=== REDIRECTING TO: " + redirectUrl.substring(0, 50));
                    response.sendRedirect(redirectUrl);
                })
                .failureHandler((request, response, exception) -> {
                    // ✅ Add this to see OAuth failures
                    System.err.println("=== OAUTH FAILURE: " + exception.getMessage());
                    exception.printStackTrace();
                    response.sendRedirect("http://localhost:5173/login?error=oauth_failed");
                })
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8181"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}