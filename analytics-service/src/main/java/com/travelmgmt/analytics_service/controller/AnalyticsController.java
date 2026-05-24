package com.travelmgmt.analytics_service.controller;

import com.travelmgmt.analytics_service.dto.AnalyticsResponse;
import com.travelmgmt.analytics_service.service.AnalyticsService;
import com.travelmgmt.analytics_service.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final JwtUtil jwtUtil;

    public AnalyticsController(AnalyticsService analyticsService,
                                JwtUtil jwtUtil) {
        this.analyticsService = analyticsService;
        this.jwtUtil = jwtUtil;
    }

    // ── Tourist opens a site page — track the view ────────────────────────────

    @PostMapping("/view")
    public ResponseEntity<AnalyticsResponse> trackView(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String siteId,
            @RequestParam String siteName,
            @RequestParam String locationId) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(analyticsService.trackView(
                siteId, siteName, locationId, userId));
    }

    // ── Tourist likes a site ──────────────────────────────────────────────────

    @PostMapping("/like")
    public ResponseEntity<AnalyticsResponse> trackLike(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String siteId,
            @RequestParam String siteName,
            @RequestParam String locationId) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(analyticsService.trackLike(
                siteId, siteName, locationId, userId));
    }

    // ── Get analytics for a site — public ────────────────────────────────────

    @GetMapping("/site/{siteId}")
    public ResponseEntity<AnalyticsResponse> getSiteAnalytics(
            @PathVariable String siteId) {
        return ResponseEntity.ok(
                analyticsService.getSiteAnalytics(siteId));
    }

    // ── Manager gets analytics for all sites in their location ────────────────

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<AnalyticsResponse>> getLocationAnalytics(
            @PathVariable String locationId) {
        return ResponseEntity.ok(
                analyticsService.getLocationAnalytics(locationId));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("analytics-service is running");
    }
}