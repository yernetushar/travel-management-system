package com.travelmgmt.chat_service.dto;

import java.time.LocalDateTime;

public class ChatMessageResponse {

    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String senderRole;
    private String receiverId;
    private String receiverName;
    private String locationId;
    private String message;
    private boolean read;
    private LocalDateTime sentAt;

    public ChatMessageResponse(String id, String conversationId,
                                String senderId, String senderName,
                                String senderRole, String receiverId,
                                String receiverName, String locationId,
                                String message, boolean read,
                                LocalDateTime sentAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.locationId = locationId;
        this.message = message;
        this.read = read;
        this.sentAt = sentAt;
    }

    public String getId() { return id; }
    public String getConversationId() { return conversationId; }
    public String getSenderId() { return senderId; }
    public String getSenderName() { return senderName; }
    public String getSenderRole() { return senderRole; }
    public String getReceiverId() { return receiverId; }
    public String getReceiverName() { return receiverName; }
    public String getLocationId() { return locationId; }
    public String getMessage() { return message; }
    public boolean isRead() { return read; }
    public LocalDateTime getSentAt() { return sentAt; }
}