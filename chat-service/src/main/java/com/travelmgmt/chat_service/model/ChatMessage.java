package com.travelmgmt.chat_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    // Conversation is between a tourist and a manager
    // conversationId = touristId + "_" + managerId + "_" + locationId
    @Indexed
    private String conversationId;

    private String senderId;
    private String senderName;
    private String senderRole;      // TOURIST or TOURISM_MANAGER

    private String receiverId;
    private String receiverName;

    private String locationId;
    private String message;

    private boolean read;           // has receiver read this message
    private LocalDateTime sentAt;

    public ChatMessage() {
        this.read = false;
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

    public void setId(String id) { this.id = id; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setMessage(String message) { this.message = message; }
    public void setRead(boolean read) { this.read = read; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}