package com.travelmgmt.analytics_service.service;

import com.travelmgmt.analytics_service.dto.AnalyticsEvent;
import com.travelmgmt.analytics_service.dto.AnalyticsResponse;
import com.travelmgmt.analytics_service.model.SiteAnalytics;
import com.travelmgmt.analytics_service.repository.SiteAnalyticsRepository;
import com.travelmgmt.analytics_service.websocket.AnalyticsWebSocketHandler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final SiteAnalyticsRepository analyticsRepository;
    private final AnalyticsWebSocketHandler webSocketHandler;

    public AnalyticsService(SiteAnalyticsRepository analyticsRepository,
                            AnalyticsWebSocketHandler webSocketHandler) {
        this.analyticsRepository = analyticsRepository;
        this.webSocketHandler = webSocketHandler;
    }

    // ── Record a page view ────────────────────────────────────────────────────

    public void recordView(AnalyticsEvent event) {
        SiteAnalytics analytics = getOrCreate(event);
        analytics.setTotalViews(analytics.getTotalViews() + 1);
        analytics.setLastUpdated(LocalDateTime.now());
        analyticsRepository.save(analytics);

        // Push real-time update to all WebSocket subscribers
        webSocketHandler.broadcastUpdate(analytics.getSiteId(),
                buildResponse(analytics));
    }

    // ── Record a like ─────────────────────────────────────────────────────────

    public void recordLike(AnalyticsEvent event) {
        SiteAnalytics analytics = getOrCreate(event);
        analytics.setTotalLikes(analytics.getTotalLikes() + 1);
        analytics.setLastUpdated(LocalDateTime.now());
        analyticsRepository.save(analytics);

        webSocketHandler.broadcastUpdate(analytics.getSiteId(),
                buildResponse(analytics));
    }

    // ── Real-time viewer count ────────────────────────────────────────────────

    public void incrementCurrentViewers(AnalyticsEvent event) {
        SiteAnalytics analytics = getOrCreate(event);
        analytics.setCurrentViewers(analytics.getCurrentViewers() + 1);
        analytics.setLastUpdated(LocalDateTime.now());
        analyticsRepository.save(analytics);

        webSocketHandler.broadcastUpdate(analytics.getSiteId(),
                buildResponse(analytics));
    }

    public void decrementCurrentViewers(AnalyticsEvent event) {
        SiteAnalytics analytics = getOrCreate(event);
        long current = analytics.getCurrentViewers();
        analytics.setCurrentViewers(Math.max(0, current - 1));
        analytics.setLastUpdated(LocalDateTime.now());
        analyticsRepository.save(analytics);

        webSocketHandler.broadcastUpdate(analytics.getSiteId(),
                buildResponse(analytics));
    }

    // ── Get analytics for a site ──────────────────────────────────────────────

    public AnalyticsResponse getSiteAnalytics(String siteId) {
        SiteAnalytics analytics = analyticsRepository
                .findBySiteId(siteId)
                .orElse(null);

        if (analytics == null) {
            return new AnalyticsResponse(
                    siteId, "Unknown", "Unknown",
                    0, 0, 0, 0);
        }
        return buildResponse(analytics);
    }

    // ── Get analytics for all sites in a location — manager dashboard ─────────

    public List<AnalyticsResponse> getLocationAnalytics(String locationId) {
        return analyticsRepository.findByLocationId(locationId)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ── REST trigger — when tourist opens a site page ─────────────────────────
    // Called directly by frontend or site-service

    public AnalyticsResponse trackView(String siteId, String siteName,
                                       String locationId, String userId) {
        AnalyticsEvent event = new AnalyticsEvent(
                "SITE_VIEW", siteId, siteName, locationId, userId);
        recordView(event);
        return getSiteAnalytics(siteId);
    }

    public AnalyticsResponse trackLike(String siteId, String siteName,
                                       String locationId, String userId) {
        AnalyticsEvent event = new AnalyticsEvent(
                "SITE_LIKE", siteId, siteName, locationId, userId);
        recordLike(event);
        return getSiteAnalytics(siteId);
    }

    // ── Helper — get existing or create new analytics record ─────────────────

    private SiteAnalytics getOrCreate(AnalyticsEvent event) {
        return analyticsRepository
                .findBySiteId(event.getSiteId())
                .orElseGet(() -> {
                    SiteAnalytics newAnalytics = new SiteAnalytics();
                    newAnalytics.setSiteId(event.getSiteId());
                    newAnalytics.setSiteName(event.getSiteName());
                    newAnalytics.setLocationId(event.getLocationId());
                    newAnalytics.setCreatedAt(LocalDateTime.now());
                    newAnalytics.setLastUpdated(LocalDateTime.now());
                    return newAnalytics;
                });
    }

    private AnalyticsResponse buildResponse(SiteAnalytics analytics) {
        return new AnalyticsResponse(
                analytics.getSiteId(),
                analytics.getSiteName(),
                analytics.getLocationId(),
                analytics.getTotalViews(),
                analytics.getTotalLikes(),
                analytics.getTotalBookings(),
                analytics.getCurrentViewers()
        );
    }
}