package com.travelmgmt.chat_service.kafka;

import com.travelmgmt.chat_service.dto.ChatMessageResponse;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class ChatProducer {

    private final KafkaTemplate<String, ChatMessageResponse> kafkaTemplate;

    public ChatProducer(
            KafkaTemplate<String, ChatMessageResponse> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(ChatMessageResponse message) {
        // Key is conversationId so all messages in same
        // conversation go to same partition — ordered delivery
        kafkaTemplate.send("chat-messages",
                message.getConversationId(), message);
        System.out.println("Message sent to Kafka: "
                + message.getMessage());
    }
}