package com.travelmgmt.notification_service.dto;

public class NotificationEvent {

    private String type;
    private String userId;
    private String userEmail;
    private String userName;
    private String title;
    private String message;
    private String relatedId;
    private String locationId;

    public NotificationEvent() {}

    public String getType() { return type; }
    public String getUserId() { return userId; }
    public String getUserEmail() { return userEmail; }
    public String getUserName() { return userName; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getRelatedId() { return relatedId; }
    public String getLocationId() { return locationId; }

    public void setType(String type) { this.type = type; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setRelatedId(String relatedId) { this.relatedId = relatedId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
}