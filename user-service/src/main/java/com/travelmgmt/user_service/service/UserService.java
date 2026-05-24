package com.travelmgmt.user_service.service;

import com.travelmgmt.user_service.dto.UpdateProfileRequest;
import com.travelmgmt.user_service.dto.UserProfileResponse;
import com.travelmgmt.user_service.model.UserProfile;
import com.travelmgmt.user_service.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get profile by email (extracted from JWT)
    public UserProfileResponse getMyProfile(String email) {
        UserProfile user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    // Get any profile by ID (public — tourists viewing manager profiles)
    public UserProfileResponse getProfileById(String userId) {
        UserProfile user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    // Update own profile
    public UserProfileResponse updateMyProfile(String email,
                                               UpdateProfileRequest request) {
        UserProfile user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only update fields that are sent — ignore nulls
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return mapToResponse(user);
    }

    // Helper
    private UserProfileResponse mapToResponse(UserProfile user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getLocationId(),
                user.getLocationName(),
                user.getProfilePicture(),
                user.getPhone(),
                user.getBio()
        );
    }
}