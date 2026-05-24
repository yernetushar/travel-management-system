package com.travelmgmt.analytics_service.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final AnalyticsWebSocketHandler analyticsWebSocketHandler;

    public WebSocketConfig(AnalyticsWebSocketHandler analyticsWebSocketHandler) {
        this.analyticsWebSocketHandler = analyticsWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(analyticsWebSocketHandler, "/ws/analytics/{siteId}")
                .setAllowedOrigins("*");
    }
}