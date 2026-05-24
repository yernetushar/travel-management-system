package com.travelmgmt.user_service.dto;

public class UserProfileResponse {

    private String id;
    private String email;
    private String name;
    private String role;
    private String locationId;
    private String locationName;
    private String profilePicture;
    private String phone;
    private String bio;

    // Constructor
    public UserProfileResponse(String id, String email, String name,
                                String role, String locationId,
                                String locationName, String profilePicture,
                                String phone, String bio) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.locationId = locationId;
        this.locationName = locationName;
        this.profilePicture = profilePicture;
        this.phone = phone;
        this.bio = bio;
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getLocationId() { return locationId; }
    public String getLocationName() { return locationName; }
    public String getProfilePicture() { return profilePicture; }
    public String getPhone() { return phone; }
    public String getBio() { return bio; }
}