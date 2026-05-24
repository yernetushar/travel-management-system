package com.travelmgmt.site_service.controller;

import com.travelmgmt.site_service.dto.CreateSiteRequest;
import com.travelmgmt.site_service.dto.SiteResponse;
import com.travelmgmt.site_service.dto.UpdateSiteRequest;
import com.travelmgmt.site_service.service.SiteService;
import com.travelmgmt.site_service.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sites")
@CrossOrigin(origins = "*")
public class SiteController {

    private final SiteService siteService;
    private final JwtUtil jwtUtil;

    public SiteController(SiteService siteService, JwtUtil jwtUtil) {
        this.siteService = siteService;
        this.jwtUtil = jwtUtil;
    }

    // ── Manager endpoints ─────────────────────────────────────────────────────

    // Manager creates a site
    @PostMapping
    public ResponseEntity<SiteResponse> createSite(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateSiteRequest request) {

        String token       = authHeader.replace("Bearer ", "");
        String role        = jwtUtil.extractRole(token);

        if (!"TOURISM_MANAGER".equals(role)) {
            throw new RuntimeException("Only Tourism Managers can create sites");
        }

        String managerId   = jwtUtil.extractUserId(token);
        String managerName = jwtUtil.extractName(token);
        String locationId  = jwtUtil.extractLocationId(token);
        String locationName = jwtUtil.extractLocationName(token);

        return ResponseEntity.ok(siteService.createSite(
                request, managerId, managerName, locationId, locationName));
    }

    // Manager updates their site
    @PutMapping("/{siteId}")
    public ResponseEntity<SiteResponse> updateSite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String siteId,
            @RequestBody UpdateSiteRequest request) {

        String token     = authHeader.replace("Bearer ", "");
        String managerId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(siteService.updateSite(
                siteId, request, managerId));
    }

    // Manager deletes their site
    @DeleteMapping("/{siteId}")
    public ResponseEntity<String> deleteSite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String siteId) {

        String token     = authHeader.replace("Bearer ", "");
        String managerId = jwtUtil.extractUserId(token);

        siteService.deleteSite(siteId, managerId);
        return ResponseEntity.ok("Site deleted successfully");
    }

    // Manager sees all their own sites
    @GetMapping("/my")
    public ResponseEntity<List<SiteResponse>> getMySites(
            @RequestHeader("Authorization") String authHeader) {

        String token     = authHeader.replace("Bearer ", "");
        String managerId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(siteService.getMySites(managerId));
    }

    // ── Tourist endpoints ─────────────────────────────────────────────────────

    // Tourist gets all active sites for a location
    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<SiteResponse>> getSitesByLocation(
            @PathVariable String locationId) {
        return ResponseEntity.ok(siteService.getSitesByLocation(locationId));
    }

    // Tourist gets single site details
    @GetMapping("/{siteId}")
    public ResponseEntity<SiteResponse> getSiteById(
            @PathVariable String siteId) {
        return ResponseEntity.ok(siteService.getSiteById(siteId));
    }

    // Tourist searches sites by keyword
    @GetMapping("/location/{locationId}/search")
    public ResponseEntity<List<SiteResponse>> searchSites(
            @PathVariable String locationId,
            @RequestParam String keyword) {
        return ResponseEntity.ok(siteService.searchSites(locationId, keyword));
    }

    // Tourist filters by category
    @GetMapping("/location/{locationId}/category/{category}")
    public ResponseEntity<List<SiteResponse>> getSitesByCategory(
            @PathVariable String locationId,
            @PathVariable String category) {
        return ResponseEntity.ok(
                siteService.getSitesByCategory(locationId, category));
    }

    // ── Analytics endpoints — called by analytics service ─────────────────────

    @PutMapping("/{siteId}/view")
    public ResponseEntity<String> incrementView(@PathVariable String siteId) {
        siteService.incrementViewCount(siteId);
        return ResponseEntity.ok("View counted");
    }

    @PutMapping("/{siteId}/like")
    public ResponseEntity<String> incrementLike(@PathVariable String siteId) {
        siteService.incrementLikeCount(siteId);
        return ResponseEntity.ok("Like counted");
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("site-service is running");
    }
}