package com.travelmgmt.site_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "sites")
public class Site {

    @Id
    private String id;

    private String name;                    // site name e.g. "Calangute Beach"
    private String description;             // detailed description
    private String shortDescription;        // one liner for cards

    @Indexed
    private String locationId;             // e.g. "goa" — used to filter by location
    private String locationName;           // e.g. "Goa"

    private String managerId;              // who created/manages this site
    private String managerName;

    private String category;               // BEACH | TEMPLE | FORT | MUSEUM | PARK | OTHER
    private String address;                // full address
    private String openingHours;           // e.g. "9:00 AM - 6:00 PM"
    private String entryFee;               // e.g. "Free" or "₹50"

    private List<String> imageUrls;        // list of image URLs

    private double latitude;
    private double longitude;

    private boolean active;                // only active sites shown to tourists

    private long viewCount;                // incremented by analytics service
    private long likeCount;               // incremented by analytics service

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor
    public Site() {
        this.imageUrls = new ArrayList<>();
        this.active = true;
        this.viewCount = 0;
        this.likeCount = 0;
    }

    // Getters
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

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public void setManagerId(String managerId) { this.managerId = managerId; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public void setCategory(String category) { this.category = category; }
    public void setAddress(String address) { this.address = address; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }
    public void setEntryFee(String entryFee) { this.entryFee = entryFee; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public void setActive(boolean active) { this.active = active; }
    public void setViewCount(long viewCount) { this.viewCount = viewCount; }
    public void setLikeCount(long likeCount) { this.likeCount = likeCount; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}