package com.travelmgmt.analytics_service.kafka;

import com.travelmgmt.analytics_service.dto.AnalyticsEvent;
import com.travelmgmt.analytics_service.service.AnalyticsService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsConsumer {

    private final AnalyticsService analyticsService;

    public AnalyticsConsumer(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // Consume view and viewer join/leave events
    @KafkaListener(topics = "site-views", groupId = "analytics-group")
    public void consumeViewEvent(AnalyticsEvent event) {
        System.out.println("Analytics event received: "
                + event.getEventType() + " for site: " + event.getSiteId());

        switch (event.getEventType()) {
            case "SITE_VIEW":
                analyticsService.recordView(event);
                break;
            case "VIEWER_JOIN":
                analyticsService.incrementCurrentViewers(event);
                break;
            case "VIEWER_LEAVE":
                analyticsService.decrementCurrentViewers(event);
                break;
        }
    }

    // Consume like events
    @KafkaListener(topics = "site-likes", groupId = "analytics-group")
    public void consumeLikeEvent(AnalyticsEvent event) {
        System.out.println("Like event received for site: " + event.getSiteId());
        analyticsService.recordLike(event);
    }
}