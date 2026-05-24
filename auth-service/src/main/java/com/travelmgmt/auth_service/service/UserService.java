package com.travelmgmt.auth_service.service;

import com.travelmgmt.auth_service.model.AuthProvider;
import com.travelmgmt.auth_service.model.Role;
import com.travelmgmt.auth_service.model.User;
import com.travelmgmt.auth_service.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveOAuthUser(String email, String name) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Email not found from OAuth provider");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            User user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(Role.TOURIST);             // ← was missing
            user.setProvider(AuthProvider.GOOGLE);
            user.setEnabled(true);                  // ← was missing
            user.setCreatedAt(LocalDateTime.now()); // ← was missing
            user.setUpdatedAt(LocalDateTime.now()); // ← was missing
            userRepository.save(user);
            System.out.println("User saved: " + email);
        } else {
            System.out.println("User already exists: " + email);
        }
    }
}