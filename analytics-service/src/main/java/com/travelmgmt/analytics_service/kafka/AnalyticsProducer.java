package com.travelmgmt.analytics_service.kafka;

import com.travelmgmt.analytics_service.dto.AnalyticsEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsProducer {

    private final KafkaTemplate<String, AnalyticsEvent> kafkaTemplate;

    public AnalyticsProducer(KafkaTemplate<String, AnalyticsEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendViewEvent(String siteId, String siteName,
                              String locationId, String userId) {
        AnalyticsEvent event = new AnalyticsEvent(
                "SITE_VIEW", siteId, siteName, locationId, userId);
        kafkaTemplate.send("site-views", siteId, event);
    }

    public void sendLikeEvent(String siteId, String siteName,
                              String locationId, String userId) {
        AnalyticsEvent event = new AnalyticsEvent(
                "SITE_LIKE", siteId, siteName, locationId, userId);
        kafkaTemplate.send("site-likes", siteId, event);
    }

    public void sendViewerJoin(String siteId, String siteName,
                               String locationId, String userId) {
        AnalyticsEvent event = new AnalyticsEvent(
                "VIEWER_JOIN", siteId, siteName, locationId, userId);
        kafkaTemplate.send("site-views", siteId, event);
    }

    public void sendViewerLeave(String siteId, String siteName,
                                String locationId, String userId) {
        AnalyticsEvent event = new AnalyticsEvent(
                "VIEWER_LEAVE", siteId, siteName, locationId, userId);
        kafkaTemplate.send("site-views", siteId, event);
    }
}