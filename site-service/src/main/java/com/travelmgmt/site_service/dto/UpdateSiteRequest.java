package com.travelmgmt.site_service.dto;

import java.util.List;

public class UpdateSiteRequest {

    private String name;
    private String description;
    private String shortDescription;
    private String category;
    private String address;
    private String openingHours;
    private String entryFee;
    private double latitude;
    private double longitude;
    private List<String> imageUrls;
    private Boolean active;

    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getShortDescription() { return shortDescription; }
    public String getCategory() { return category; }
    public String getAddress() { return address; }
    public String getOpeningHours() { return openingHours; }
    public String getEntryFee() { return entryFee; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public List<String> getImageUrls() { return imageUrls; }
    public Boolean getActive() { return active; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public void setCategory(String category) { this.category = category; }
    public void setAddress(String address) { this.address = address; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }
    public void setEntryFee(String entryFee) { this.entryFee = entryFee; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public void setActive(Boolean active) { this.active = active; }
}