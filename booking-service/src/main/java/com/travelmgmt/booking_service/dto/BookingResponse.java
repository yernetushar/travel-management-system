package com.travelmgmt.booking_service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {

    private String id;
    private String userId;
    private String userEmail;
    private String userName;
    private String siteId;
    private String siteName;
    private String locationId;
    private LocalDate visitDate;
    private int numberOfPeople;
    private String status;
    private String notes;
    private LocalDateTime bookedAt;

    public BookingResponse(String id, String userId, String userEmail,
                           String userName, String siteId, String siteName,
                           String locationId, LocalDate visitDate,
                           int numberOfPeople, String status,
                           String notes, LocalDateTime bookedAt) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.siteId = siteId;
        this.siteName = siteName;
        this.locationId = locationId;
        this.visitDate = visitDate;
        this.numberOfPeople = numberOfPeople;
        this.status = status;
        this.notes = notes;
        this.bookedAt = bookedAt;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getUserEmail() { return userEmail; }
    public String getUserName() { return userName; }
    public String getSiteId() { return siteId; }
    public String getSiteName() { return siteName; }
    public String getLocationId() { return locationId; }
    public LocalDate getVisitDate() { return visitDate; }
    public int getNumberOfPeople() { return numberOfPeople; }
    public String getStatus() { return status; }
    public String getNotes() { return notes; }
    public LocalDateTime getBookedAt() { return bookedAt; }
}