package com.travelmgmt.notification_service.dto;

import java.time.LocalDateTime;

public class NotificationResponse {

    private String id;
    private String userId;
    private String type;
    private String title;
    private String message;
    private String relatedId;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse(String id, String userId,
                                 String type, String title,
                                 String message, String relatedId,
                                 boolean read,
                                 LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.relatedId = relatedId;
        this.read = read;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getRelatedId() { return relatedId; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}