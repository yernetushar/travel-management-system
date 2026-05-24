package com.travelmgmt.image_service.dto;

import java.time.LocalDateTime;

public class ImageResponse {

    private String id;
    private String siteId;
    private String siteName;
    private String locationId;
    private String uploadedBy;
    private String uploadedByName;
    private String fileName;
    private String contentType;
    private long fileSize;
    private String imageUrl;        // use this to display image in frontend
    private LocalDateTime uploadedAt;

    // No imageData here — we don't return raw Base64 in list responses
    // Use GET /images/{id}/data for the actual image bytes

    public ImageResponse(String id, String siteId, String siteName,
                         String locationId, String uploadedBy,
                         String uploadedByName, String fileName,
                         String contentType, long fileSize,
                         String imageUrl, LocalDateTime uploadedAt) {
        this.id = id;
        this.siteId = siteId;
        this.siteName = siteName;
        this.locationId = locationId;
        this.uploadedBy = uploadedBy;
        this.uploadedByName = uploadedByName;
        this.fileName = fileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.imageUrl = imageUrl;
        this.uploadedAt = uploadedAt;
    }

    public String getId() { return id; }
    public String getSiteId() { return siteId; }
    public String getSiteName() { return siteName; }
    public String getLocationId() { return locationId; }
    public String getUploadedBy() { return uploadedBy; }
    public String getUploadedByName() { return uploadedByName; }
    public String getFileName() { return fileName; }
    public String getContentType() { return contentType; }
    public long getFileSize() { return fileSize; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
}