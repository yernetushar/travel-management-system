package com.travelmgmt.booking_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String userId;          // who booked
    private String userEmail;       // for display
    private String userName;        // for display

    private String siteId;          // which site is booked
    private String siteName;        // for display
    private String locationId;      // which location this site belongs to

    private LocalDate visitDate;    // date of visit
    private int numberOfPeople;     // how many people

    private String status;          // PENDING | CONFIRMED | CANCELLED

    private String notes;           // optional notes from tourist

    private LocalDateTime bookedAt;
    private LocalDateTime updatedAt;

    // Getters
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
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setSiteId(String siteId) { this.siteId = siteId; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }
    public void setNumberOfPeople(int numberOfPeople) { this.numberOfPeople = numberOfPeople; }
    public void setStatus(String status) { this.status = status; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}