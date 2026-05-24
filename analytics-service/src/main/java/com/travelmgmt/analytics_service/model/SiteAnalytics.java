package com.travelmgmt.analytics_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "site_analytics")
public class SiteAnalytics {

    @Id
    private String id;

    @Indexed(unique = true)
    private String siteId;

    private String siteName;
    private String locationId;

    private long totalViews;
    private long totalLikes;
    private long totalBookings;

    // Real-time current viewers (people currently on the page)
    private long currentViewers;

    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;

    public SiteAnalytics() {
        this.totalViews = 0;
        this.totalLikes = 0;
        this.totalBookings = 0;
        this.currentViewers = 0;
    }

    public String getId() { return id; }
    public String getSiteId() { return siteId; }
    public String getSiteName() { return siteName; }
    public String getLocationId() { return locationId; }
    public long getTotalViews() { return totalViews; }
    public long getTotalLikes() { return totalLikes; }
    public long getTotalBookings() { return totalBookings; }
    public long getCurrentViewers() { return currentViewers; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(String id) { this.id = id; }
    public void setSiteId(String siteId) { this.siteId = siteId; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setTotalViews(long totalViews) { this.totalViews = totalViews; }
    public void setTotalLikes(long totalLikes) { this.totalLikes = totalLikes; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
    public void setCurrentViewers(long currentViewers) { this.currentViewers = currentViewers; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}