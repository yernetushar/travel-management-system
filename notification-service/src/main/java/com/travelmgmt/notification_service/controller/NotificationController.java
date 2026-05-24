package com.travelmgmt.notification_service.controller;

import com.travelmgmt.notification_service.dto.NotificationResponse;
import com.travelmgmt.notification_service.service.NotificationService;
import com.travelmgmt.notification_service.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    public NotificationController(
            NotificationService notificationService,
            JwtUtil jwtUtil) {
        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
    }

    // Get all my notifications
    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @RequestHeader("Authorization") String authHeader) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(
                notificationService.getMyNotifications(userId));
    }

    // Get unread notifications
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread(
            @RequestHeader("Authorization") String authHeader) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId));
    }

    // Get unread count — for notification badge in frontend
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String authHeader) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Mark one as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(
            @PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok("Notification marked as read");
    }

    // Mark all as read
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(
            @RequestHeader("Authorization") String authHeader) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }

    // Send notification directly — for testing
    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> sendNotification(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);
        String email  = jwtUtil.extractEmail(token);

        return ResponseEntity.ok(
                notificationService.sendDirectNotification(
                        userId, email,
                        body.get("type"),
                        body.get("title"),
                        body.get("message"),
                        body.get("relatedId")));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "notification-service is running");
    }
}