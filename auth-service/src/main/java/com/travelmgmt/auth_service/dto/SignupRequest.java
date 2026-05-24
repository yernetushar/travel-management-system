package com.travelmgmt.auth_service.dto;

import com.travelmgmt.auth_service.model.Role;

public class SignupRequest {

    private String email;
    private String password;
    private String name;
    private Role role;

    private String locationId;
    private String locationName;

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public Role getRole() { return role; }
    public String getLocationId() { return locationId; }
    public String getLocationName() { return locationName; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setName(String name) { this.name = name; }
    public void setRole(Role role) { this.role = role; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
}