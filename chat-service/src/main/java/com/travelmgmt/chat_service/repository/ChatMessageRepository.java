package com.travelmgmt.chat_service.repository;

import com.travelmgmt.chat_service.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository
        extends MongoRepository<ChatMessage, String> {

    // Get all messages in a conversation — ordered by time
    List<ChatMessage> findByConversationIdOrderBySentAtAsc(
            String conversationId);

    // Get all conversations for a user (tourist or manager)
    List<ChatMessage> findBySenderIdOrReceiverId(
            String senderId, String receiverId);

    // Unread messages for a user
    List<ChatMessage> findByReceiverIdAndReadFalse(String receiverId);

    // All messages for a location — for manager dashboard
    List<ChatMessage> findByLocationId(String locationId);
}