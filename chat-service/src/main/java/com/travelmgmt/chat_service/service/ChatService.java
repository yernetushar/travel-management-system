package com.travelmgmt.chat_service.service;

import com.travelmgmt.chat_service.dto.ChatMessageRequest;
import com.travelmgmt.chat_service.dto.ChatMessageResponse;
import com.travelmgmt.chat_service.kafka.ChatProducer;
import com.travelmgmt.chat_service.model.ChatMessage;
import com.travelmgmt.chat_service.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatProducer chatProducer;

    public ChatService(ChatMessageRepository chatMessageRepository,
                       ChatProducer chatProducer) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatProducer = chatProducer;
    }

    // ── Send a message ────────────────────────────────────────────────────────

    public ChatMessageResponse sendMessage(ChatMessageRequest request,
                                           String senderId,
                                           String senderName,
                                           String senderRole) {

        if (request.getMessage() == null
                || request.getMessage().isBlank()) {
            throw new RuntimeException("Message cannot be empty");
        }

        // Build conversation ID — always consistent regardless
        // of who initiates. Format: smallerId_largerId_locationId
        String conversationId = buildConversationId(
                senderId,
                request.getReceiverId(),
                request.getLocationId());

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setConversationId(conversationId);
        chatMessage.setSenderId(senderId);
        chatMessage.setSenderName(senderName);
        chatMessage.setSenderRole(senderRole);
        chatMessage.setReceiverId(request.getReceiverId());
        chatMessage.setReceiverName(request.getReceiverName());
        chatMessage.setLocationId(request.getLocationId());
        chatMessage.setMessage(request.getMessage());
        chatMessage.setRead(false);
        chatMessage.setSentAt(LocalDateTime.now());

        chatMessageRepository.save(chatMessage);

        ChatMessageResponse response = mapToResponse(chatMessage);

        // Send to Kafka — consumer will deliver via WebSocket
        chatProducer.sendMessage(response);

        return response;
    }

    // ── Get conversation history ──────────────────────────────────────────────

    public List<ChatMessageResponse> getConversation(
            String userId1, String userId2, String locationId) {

        String conversationId = buildConversationId(
                userId1, userId2, locationId);

        return chatMessageRepository
                .findByConversationIdOrderBySentAtAsc(conversationId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get all conversations for a user ──────────────────────────────────────

    public List<ChatMessageResponse> getMyConversations(String userId) {
        return chatMessageRepository
                .findBySenderIdOrReceiverId(userId, userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get unread messages for a user ────────────────────────────────────────

    public List<ChatMessageResponse> getUnreadMessages(String userId) {
        return chatMessageRepository
                .findByReceiverIdAndReadFalse(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Mark messages as read ─────────────────────────────────────────────────

    public void markAsRead(String conversationId, String userId) {
        List<ChatMessage> unread = chatMessageRepository
                .findByConversationIdOrderBySentAtAsc(conversationId)
                .stream()
                .filter(m -> m.getReceiverId().equals(userId)
                        && !m.isRead())
                .collect(Collectors.toList());

        unread.forEach(m -> m.setRead(true));
        chatMessageRepository.saveAll(unread);
    }

    // ── Manager gets all messages for their location ──────────────────────────

    public List<ChatMessageResponse> getLocationMessages(
            String locationId) {
        return chatMessageRepository
                .findByLocationId(locationId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Helper — build consistent conversation ID ─────────────────────────────

    private String buildConversationId(String id1, String id2,
                                       String locationId) {
        // Always put smaller ID first so A_B == B_A
        String smaller = id1.compareTo(id2) < 0 ? id1 : id2;
        String larger  = id1.compareTo(id2) < 0 ? id2 : id1;
        return smaller + "_" + larger + "_" + locationId;
    }

    private ChatMessageResponse mapToResponse(ChatMessage msg) {
        return new ChatMessageResponse(
                msg.getId(),
                msg.getConversationId(),
                msg.getSenderId(),
                msg.getSenderName(),
                msg.getSenderRole(),
                msg.getReceiverId(),
                msg.getReceiverName(),
                msg.getLocationId(),
                msg.getMessage(),
                msg.isRead(),
                msg.getSentAt()
        );
    }
}