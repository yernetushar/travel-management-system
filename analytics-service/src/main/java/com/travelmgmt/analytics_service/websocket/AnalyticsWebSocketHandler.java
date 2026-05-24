package com.travelmgmt.analytics_service.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelmgmt.analytics_service.dto.AnalyticsResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;
import java.util.Map;

@Component
public class AnalyticsWebSocketHandler extends TextWebSocketHandler {

    // Map of siteId → list of connected WebSocket sessions
    private final Map<String, List<WebSocketSession>> siteSessions
            = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String siteId = extractSiteId(session);
        siteSessions.computeIfAbsent(siteId,
                k -> new CopyOnWriteArrayList<>()).add(session);
        System.out.println("WebSocket connected for site: " + siteId
                + " | Total sessions: "
                + siteSessions.get(siteId).size());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status) {
        String siteId = extractSiteId(session);
        List<WebSocketSession> sessions = siteSessions.get(siteId);
        if (sessions != null) {
            sessions.remove(session);
        }
        System.out.println("WebSocket disconnected for site: " + siteId);
    }

    // Called by AnalyticsService to push updates to all viewers of a site
    public void broadcastUpdate(String siteId, AnalyticsResponse response) {
        List<WebSocketSession> sessions = siteSessions.get(siteId);
        if (sessions == null || sessions.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(response);
            TextMessage message = new TextMessage(json);

            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    session.sendMessage(message);
                }
            }
        } catch (Exception e) {
            System.err.println("WebSocket broadcast error: " + e.getMessage());
        }
    }

    // Extract siteId from WebSocket URL path
    // URL pattern: /ws/analytics/{siteId}
    private String extractSiteId(WebSocketSession session) {
        String path = session.getUri().getPath();
        String[] parts = path.split("/");
        return parts[parts.length - 1];
    }
}