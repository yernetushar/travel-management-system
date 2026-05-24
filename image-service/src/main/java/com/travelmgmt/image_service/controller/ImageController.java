package com.travelmgmt.image_service.controller;

import com.travelmgmt.image_service.dto.ImageResponse;
import com.travelmgmt.image_service.model.ImageDocument;
import com.travelmgmt.image_service.service.ImageService;
import com.travelmgmt.image_service.util.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/images")
@CrossOrigin(origins = "*")
public class ImageController {

    private final ImageService imageService;
    private final JwtUtil jwtUtil;

    public ImageController(ImageService imageService, JwtUtil jwtUtil) {
        this.imageService = imageService;
        this.jwtUtil = jwtUtil;
    }

    // ── Manager uploads image ─────────────────────────────────────────────────

    @PostMapping("/upload")
    public ResponseEntity<ImageResponse> uploadImage(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file,
            @RequestParam("siteId") String siteId,
            @RequestParam("siteName") String siteName) throws IOException {

        String token = authHeader.replace("Bearer ", "");
        String role  = jwtUtil.extractRole(token);

        if (!"TOURISM_MANAGER".equals(role)) {
            throw new RuntimeException("Only Tourism Managers can upload images");
        }

        String managerId   = jwtUtil.extractUserId(token);
        String managerName = jwtUtil.extractName(token);
        String locationId  = jwtUtil.extractLocationId(token);

        return ResponseEntity.ok(imageService.uploadImage(
                file, siteId, siteName, managerId, managerName, locationId));
    }

    // ── Get all images for a site — public ───────────────────────────────────

    @GetMapping("/site/{siteId}")
    public ResponseEntity<List<ImageResponse>> getImagesBySite(
            @PathVariable String siteId) {
        return ResponseEntity.ok(imageService.getImagesBySite(siteId));
    }

    // ── Get raw image data — renders in browser ───────────────────────────────

    @GetMapping("/{imageId}/data")
    public ResponseEntity<byte[]> getImageData(
            @PathVariable String imageId) {

        ImageDocument image = imageService.getImageById(imageId);

        // Decode Base64 back to bytes
        byte[] imageBytes = Base64.getDecoder().decode(image.getImageData());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(image.getContentType()));
        headers.setContentLength(imageBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(imageBytes);
    }

    // ── Manager deletes an image ──────────────────────────────────────────────

    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteImage(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String imageId) {

        String token     = authHeader.replace("Bearer ", "");
        String managerId = jwtUtil.extractUserId(token);

        imageService.deleteImage(imageId, managerId);
        return ResponseEntity.ok("Image deleted successfully");
    }

    // ── Manager sees all their uploaded images ────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<List<ImageResponse>> getMyImages(
            @RequestHeader("Authorization") String authHeader) {

        String token     = authHeader.replace("Bearer ", "");
        String managerId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(imageService.getImagesByManager(managerId));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("image-service is running");
    }
}