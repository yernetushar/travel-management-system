package com.travelmgmt.user_service.dto;

public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String bio;
    private String profilePicture;

    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getBio() { return bio; }
    public String getProfilePicture() { return profilePicture; }

    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setBio(String bio) { this.bio = bio; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}