package com.travelmgmt.image_service.service;

import com.travelmgmt.image_service.dto.ImageResponse;
import com.travelmgmt.image_service.model.ImageDocument;
import com.travelmgmt.image_service.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageService {

    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    // ── Manager uploads image for a site ──────────────────────────────────────

    public ImageResponse uploadImage(MultipartFile file,
                                     String siteId,
                                     String siteName,
                                     String managerId,
                                     String managerName,
                                     String locationId) throws IOException {

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        // Validate file size — max 10MB
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size must be under 10MB");
        }

        // Convert image to Base64 for storage
        String base64Data = Base64.getEncoder()
                .encodeToString(file.getBytes());

        ImageDocument image = new ImageDocument();
        image.setSiteId(siteId);
        image.setSiteName(siteName);
        image.setLocationId(locationId);
        image.setUploadedBy(managerId);
        image.setUploadedByName(managerName);
        image.setFileName(file.getOriginalFilename());
        image.setContentType(contentType);
        image.setFileSize(file.getSize());
        image.setImageData(base64Data);
        image.setUploadedAt(LocalDateTime.now());

        imageRepository.save(image);

        // Set URL after save so we have the ID
        image.setImageUrl("http://localhost:8087/images/" + image.getId() + "/data");
        imageRepository.save(image);

        return mapToResponse(image);
    }

    // ── Get all images for a site — tourists see these ────────────────────────

    public List<ImageResponse> getImagesBySite(String siteId) {
        return imageRepository.findBySiteId(siteId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get raw image bytes — for displaying in browser ───────────────────────

    public ImageDocument getImageById(String imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
    }

    // ── Manager deletes an image ──────────────────────────────────────────────

    public void deleteImage(String imageId, String managerId) {
        ImageDocument image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        if (!image.getUploadedBy().equals(managerId)) {
            throw new RuntimeException("You can only delete your own images");
        }

        imageRepository.delete(image);
    }

    // ── Get all images uploaded by a manager ──────────────────────────────────

    public List<ImageResponse> getImagesByManager(String managerId) {
        return imageRepository.findByUploadedBy(managerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private ImageResponse mapToResponse(ImageDocument image) {
        return new ImageResponse(
                image.getId(),
                image.getSiteId(),
                image.getSiteName(),
                image.getLocationId(),
                image.getUploadedBy(),
                image.getUploadedByName(),
                image.getFileName(),
                image.getContentType(),
                image.getFileSize(),
                image.getImageUrl(),
                image.getUploadedAt()
        );
    }
}