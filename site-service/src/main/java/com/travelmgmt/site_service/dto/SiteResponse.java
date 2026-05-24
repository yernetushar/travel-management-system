package com.travelmgmt.site_service.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SiteResponse {

    private String id;
    private String name;
    private String description;
    private String shortDescription;
    private String locationId;
    private String locationName;
    private String managerId;
    private String managerName;
    private String category;
    private String address;
    private String openingHours;
    private String entryFee;
    private List<String> imageUrls;
    private double latitude;
    private double longitude;
    private boolean active;
    private long viewCount;
    private long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SiteResponse(String id, String name, String description,
                        String shortDescription, String locationId,
                        String locationName, String managerId,
                        String managerName, String category,
                        String address, String openingHours,
                        String entryFee, List<String> imageUrls,
                        double latitude, double longitude,
                        boolean active, long viewCount, long likeCount,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;
        this.locationId = locationId;
        this.locationName = locationName;
        this.managerId = managerId;
        this.managerName = managerName;
        this.category = category;
        this.address = address;
        this.openingHours = openingHours;
        this.entryFee = entryFee;
        this.imageUrls = imageUrls;
        this.latitude = latitude;
        this.longitude = longitude;
        this.active = active;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getShortDescription() { return shortDescription; }
    public String getLocationId() { return locationId; }
    public String getLocationName() { return locationName; }
    public String getManagerId() { return managerId; }
    public String getManagerName() { return managerName; }
    public String getCategory() { return category; }
    public String getAddress() { return address; }
    public String getOpeningHours() { return openingHours; }
    public String getEntryFee() { return entryFee; }
    public List<String> getImageUrls() { return imageUrls; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public boolean isActive() { return active; }
    public long getViewCount() { return viewCount; }
    public long getLikeCount() { return likeCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}