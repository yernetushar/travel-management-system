package com.travelmgmt.notification_service.service;

import com.travelmgmt.notification_service.dto.NotificationEvent;
import com.travelmgmt.notification_service.dto.NotificationResponse;
import com.travelmgmt.notification_service.model.Notification;
import com.travelmgmt.notification_service.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(
            NotificationRepository notificationRepository,
            EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    // ── Create notification from event ────────────────────────────────────────

    public void createNotification(NotificationEvent event) {
        Notification notification = new Notification();
        notification.setUserId(event.getUserId());
        notification.setUserEmail(event.getUserEmail());
        notification.setType(event.getType());
        notification.setTitle(event.getTitle());
        notification.setMessage(event.getMessage());
        notification.setRelatedId(event.getRelatedId());
        notification.setLocationId(event.getLocationId());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
        System.out.println("Notification saved for user: "
                + event.getUserId()
                + " | Type: " + event.getType());

        // Send email if user email is available
        if (event.getUserEmail() != null
                && !event.getUserEmail().isBlank()) {
            emailService.sendEmail(
                    event.getUserEmail(),
                    event.getTitle(),
                    event.getMessage());
            notification.setEmailSent(true);
            notificationRepository.save(notification);
        }
    }

    // ── Direct notification — called by REST endpoint ─────────────────────────

    public NotificationResponse sendDirectNotification(
            String userId, String userEmail,
            String type, String title,
            String message, String relatedId) {

        NotificationEvent event = new NotificationEvent();
        event.setUserId(userId);
        event.setUserEmail(userEmail);
        event.setType(type);
        event.setTitle(title);
        event.setMessage(message);
        event.setRelatedId(relatedId);

        createNotification(event);

        return getMyNotifications(userId).get(0);
    }

    // ── Get all notifications for a user ──────────────────────────────────────

    public List<NotificationResponse> getMyNotifications(String userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get unread notifications ──────────────────────────────────────────────

    public List<NotificationResponse> getUnreadNotifications(
            String userId) {
        return notificationRepository
                .findByUserIdAndReadFalse(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get unread count ──────────────────────────────────────────────────────

    public long getUnreadCount(String userId) {
        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }

    // ── Mark notification as read ─────────────────────────────────────────────

    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // ── Mark all as read ──────────────────────────────────────────────────────

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private NotificationResponse mapToResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getUserId(),
                n.getType(),
                n.getTitle(),
                n.getMessage(),
                n.getRelatedId(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}