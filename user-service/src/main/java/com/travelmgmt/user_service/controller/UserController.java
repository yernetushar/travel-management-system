package com.travelmgmt.user_service.controller;

import com.travelmgmt.user_service.dto.UpdateProfileRequest;
import com.travelmgmt.user_service.dto.UserProfileResponse;
import com.travelmgmt.user_service.service.UserService;
import com.travelmgmt.user_service.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // GET my own profile — tourist or manager
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(userService.getMyProfile(email));
    }

    // GET any user profile by ID — used by frontend to show manager info
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfileById(
            @PathVariable String userId) {
        return ResponseEntity.ok(userService.getProfileById(userId));
    }

    // PUT update my profile
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(userService.updateMyProfile(email, request));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("user-service is running");
    }
}