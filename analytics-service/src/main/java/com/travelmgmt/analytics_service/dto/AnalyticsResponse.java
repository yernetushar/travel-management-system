package com.travelmgmt.analytics_service.dto;

public class AnalyticsResponse {

    private String siteId;
    private String siteName;
    private String locationId;
    private long totalViews;
    private long totalLikes;
    private long totalBookings;
    private long currentViewers;

    public AnalyticsResponse(String siteId, String siteName,
                              String locationId, long totalViews,
                              long totalLikes, long totalBookings,
                              long currentViewers) {
        this.siteId = siteId;
        this.siteName = siteName;
        this.locationId = locationId;
        this.totalViews = totalViews;
        this.totalLikes = totalLikes;
        this.totalBookings = totalBookings;
        this.currentViewers = currentViewers;
    }

    public String getSiteId() { return siteId; }
    public String getSiteName() { return siteName; }
    public String getLocationId() { return locationId; }
    public long getTotalViews() { return totalViews; }
    public long getTotalLikes() { return totalLikes; }
    public long getTotalBookings() { return totalBookings; }
    public long getCurrentViewers() { return currentViewers; }
}