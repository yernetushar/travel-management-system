package com.travelmgmt.image_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "images")
public class ImageDocument {

    @Id
    private String id;

    private String siteId;          // which site this image belongs to
    private String siteName;        // for display
    private String locationId;      // which location

    private String uploadedBy;      // managerId who uploaded
    private String uploadedByName;  // manager name

    private String fileName;        // original file name
    private String contentType;     // image/jpeg, image/png etc
    private long fileSize;          // in bytes

    // Stored as Base64 string in MongoDB
    // For production use GridFS or S3 — this works for development
    private String imageData;

    private String imageUrl;        // URL to access this image via API

    private LocalDateTime uploadedAt;

    // Getters
    public String getId() { return id; }
    public String getSiteId() { return siteId; }
    public String getSiteName() { return siteName; }
    public String getLocationId() { return locationId; }
    public String getUploadedBy() { return uploadedBy; }
    public String getUploadedByName() { return uploadedByName; }
    public String getFileName() { return fileName; }
    public String getContentType() { return contentType; }
    public long getFileSize() { return fileSize; }
    public String getImageData() { return imageData; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setSiteId(String siteId) { this.siteId = siteId; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    public void setImageData(String imageData) { this.imageData = imageData; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}