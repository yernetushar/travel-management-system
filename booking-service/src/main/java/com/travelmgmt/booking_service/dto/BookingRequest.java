package com.travelmgmt.booking_service.dto;

import java.time.LocalDate;

public class BookingRequest {

    private String siteId;
    private String siteName;
    private String locationId;
    private LocalDate visitDate;
    private int numberOfPeople;
    private String notes;

    public String getSiteId() { return siteId; }
    public String getSiteName() { return siteName; }
    public String getLocationId() { return locationId; }
    public LocalDate getVisitDate() { return visitDate; }
    public int getNumberOfPeople() { return numberOfPeople; }
    public String getNotes() { return notes; }

    public void setSiteId(String siteId) { this.siteId = siteId; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }
    public void setNumberOfPeople(int numberOfPeople) { this.numberOfPeople = numberOfPeople; }
    public void setNotes(String notes) { this.notes = notes; }
}