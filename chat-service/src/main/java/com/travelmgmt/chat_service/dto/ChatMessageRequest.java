package com.travelmgmt.chat_service.dto;

public class ChatMessageRequest {

    private String receiverId;
    private String receiverName;
    private String locationId;
    private String message;

    public String getReceiverId() { return receiverId; }
    public String getReceiverName() { return receiverName; }
    public String getLocationId() { return locationId; }
    public String getMessage() { return message; }

    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setMessage(String message) { this.message = message; }
}