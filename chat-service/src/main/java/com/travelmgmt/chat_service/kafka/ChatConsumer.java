package com.travelmgmt.chat_service.kafka;

import com.travelmgmt.chat_service.dto.ChatMessageResponse;
import com.travelmgmt.chat_service.websocket.ChatWebSocketHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ChatConsumer {

    private final ChatWebSocketHandler webSocketHandler;

    public ChatConsumer(ChatWebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @KafkaListener(topics = "chat-messages", groupId = "chat-group")
    public void consumeMessage(ChatMessageResponse message) {
        System.out.println("Message consumed from Kafka: "
                + message.getMessage()
                + " | To: " + message.getReceiverName());

        // Push to receiver via WebSocket
        webSocketHandler.sendToUser(
                message.getReceiverId(), message);

        // Also push to sender so they see it in their own chat window
        webSocketHandler.sendToUser(
                message.getSenderId(), message);
    }
}