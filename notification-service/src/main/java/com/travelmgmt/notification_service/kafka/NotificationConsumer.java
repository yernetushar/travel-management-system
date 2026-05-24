package com.travelmgmt.notification_service.kafka;

import com.travelmgmt.notification_service.dto.NotificationEvent;
import com.travelmgmt.notification_service.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private final NotificationService notificationService;

    public NotificationConsumer(
            NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Consume booking events from booking-service
    @KafkaListener(
            topics = "booking-events",
            groupId = "notification-group")
    public void consumeBookingEvent(NotificationEvent event) {
        System.out.println("Booking event received: "
                + event.getType());
        notificationService.createNotification(event);
    }

    // Consume general notifications from any service
    @KafkaListener(
            topics = "notifications",
            groupId = "notification-group")
    public void consumeNotification(NotificationEvent event) {
        System.out.println("Notification event received: "
                + event.getType());
        notificationService.createNotification(event);
    }
}