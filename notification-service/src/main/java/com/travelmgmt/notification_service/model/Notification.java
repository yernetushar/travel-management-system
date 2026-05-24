package com.travelmgmt.notification_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Indexed
    private String userId;          // who receives this notification

    private String userEmail;       // for email delivery

    private String type;            // BOOKING_CONFIRMED | BOOKING_CANCELLED
                                    // NEW_MESSAGE | SITE_UPDATED | NEW_BOOKING

    private String title;           // short title
    private String message;         // full message

    private String relatedId;       // bookingId or messageId or siteId
    private String locationId;

    private boolean read;
    private boolean emailSent;

    private LocalDateTime createdAt;

    public Notification() {
        this.read = false;
        this.emailSent = false;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getUserEmail() { return userEmail; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getRelatedId() { return relatedId; }
    public String getLocationId() { return locationId; }
    public boolean isRead() { return read; }
    public boolean isEmailSent() { return emailSent; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setType(String type) { this.type = type; }
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setRelatedId(String relatedId) { this.relatedId = relatedId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setRead(boolean read) { this.read = read; }
    public void setEmailSent(boolean emailSent) { this.emailSent = emailSent; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}