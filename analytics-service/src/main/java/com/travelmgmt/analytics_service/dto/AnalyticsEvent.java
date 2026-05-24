package com.travelmgmt.analytics_service.dto;

public class AnalyticsEvent {

    // Event types: SITE_VIEW, SITE_LIKE, SITE_BOOKING, VIEWER_JOIN, VIEWER_LEAVE
    private String eventType;
    private String siteId;
    private String siteName;
    private String locationId;
    private String userId;

    public AnalyticsEvent() {}

    public AnalyticsEvent(String eventType, String siteId,
                          String siteName, String locationId,
                          String userId) {
        this.eventType = eventType;
        this.siteId = siteId;
        this.siteName = siteName;
        this.locationId = locationId;
        this.userId = userId;
    }

    public String getEventType() { return eventType; }
    public String getSiteId() { return siteId; }
    public String getSiteName() { return siteName; }
    public String getLocationId() { return locationId; }
    public String getUserId() { return userId; }

    public void setEventType(String eventType) { this.eventType = eventType; }
    public void setSiteId(String siteId) { this.siteId = siteId; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setUserId(String userId) { this.userId = userId; }
}