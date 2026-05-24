package com.travelmgmt.chat_service.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.travelmgmt.chat_service.dto.ChatMessageResponse;
import com.travelmgmt.chat_service.util.JwtUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // Map of userId → WebSocketSession
    // Each user has one active WebSocket connection
    private final Map<String, WebSocketSession> userSessions
            = new ConcurrentHashMap<>();

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    public ChatWebSocketHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            // Extract JWT token from URL query param
            // URL: ws://localhost:8085/ws/chat?token=eyJ...
            String token = extractToken(session);
            if (token == null || !jwtUtil.validateToken(token)) {
                session.close(CloseStatus.BAD_DATA);
                return;
            }

            String userId = jwtUtil.extractUserId(token);
            String userName = jwtUtil.extractName(token);

            // Store session mapped to userId
            userSessions.put(userId, session);

            System.out.println("Chat WebSocket connected: "
                    + userName + " (" + userId + ")");
            System.out.println("Active connections: "
                    + userSessions.size());

        } catch (Exception e) {
            System.err.println("WebSocket connection error: "
                    + e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status) {
        // Remove session when user disconnects
        userSessions.entrySet()
                .removeIf(entry -> entry.getValue()
                        .getId().equals(session.getId()));
        System.out.println("Chat WebSocket disconnected. Active: "
                + userSessions.size());
    }

    // Send message to a specific user by their userId
    public void sendToUser(String userId,
                           ChatMessageResponse message) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                String json = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(json));
                System.out.println("Message delivered via WebSocket to: "
                        + userId);
            } catch (Exception e) {
                System.err.println("WebSocket send error: "
                        + e.getMessage());
            }
        } else {
            System.out.println("User " + userId
                    + " not connected — message saved in DB only");
        }
    }

    // Check if a user is currently online
    public boolean isUserOnline(String userId) {
        WebSocketSession session = userSessions.get(userId);
        return session != null && session.isOpen();
    }

    // Extract token from WebSocket URL query string
    private String extractToken(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query == null) return null;

        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2 && pair[0].equals("token")) {
                return pair[1];
            }
        }
        return null;
    }
}