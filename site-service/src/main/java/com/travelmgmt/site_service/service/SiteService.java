package com.travelmgmt.site_service.service;

import com.travelmgmt.site_service.dto.CreateSiteRequest;
import com.travelmgmt.site_service.dto.SiteResponse;
import com.travelmgmt.site_service.dto.UpdateSiteRequest;
import com.travelmgmt.site_service.model.Site;
import com.travelmgmt.site_service.repository.SiteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SiteService {

    private final SiteRepository siteRepository;

    public SiteService(SiteRepository siteRepository) {
        this.siteRepository = siteRepository;
    }

    // ── Manager creates a site ────────────────────────────────────────────────

    public SiteResponse createSite(CreateSiteRequest request,
                                   String managerId,
                                   String managerName,
                                   String locationId,
                                   String locationName) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Site name is required");
        }
        if (locationId == null || locationId.isBlank()) {
            throw new RuntimeException("Manager must have a locationId in token");
        }

        Site site = new Site();
        site.setName(request.getName());
        site.setDescription(request.getDescription());
        site.setShortDescription(request.getShortDescription());
        site.setLocationId(locationId);
        site.setLocationName(locationName);
        site.setManagerId(managerId);
        site.setManagerName(managerName);
        site.setCategory(request.getCategory());
        site.setAddress(request.getAddress());
        site.setOpeningHours(request.getOpeningHours());
        site.setEntryFee(request.getEntryFee());
        site.setLatitude(request.getLatitude());
        site.setLongitude(request.getLongitude());
        site.setActive(true);
        site.setViewCount(0);
        site.setLikeCount(0);

        if (request.getImageUrls() != null) {
            site.setImageUrls(request.getImageUrls());
        }

        site.setCreatedAt(LocalDateTime.now());
        site.setUpdatedAt(LocalDateTime.now());

        siteRepository.save(site);
        return mapToResponse(site);
    }

    // ── Manager updates their site ────────────────────────────────────────────

    public SiteResponse updateSite(String siteId,
                                   UpdateSiteRequest request,
                                   String managerId) {

        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));

        if (!site.getManagerId().equals(managerId)) {
            throw new RuntimeException("You can only update your own sites");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            site.setName(request.getName());
        }
        if (request.getDescription() != null) {
            site.setDescription(request.getDescription());
        }
        if (request.getShortDescription() != null) {
            site.setShortDescription(request.getShortDescription());
        }
        if (request.getCategory() != null) {
            site.setCategory(request.getCategory());
        }
        if (request.getAddress() != null) {
            site.setAddress(request.getAddress());
        }
        if (request.getOpeningHours() != null) {
            site.setOpeningHours(request.getOpeningHours());
        }
        if (request.getEntryFee() != null) {
            site.setEntryFee(request.getEntryFee());
        }
        if (request.getImageUrls() != null) {
            site.setImageUrls(request.getImageUrls());
        }
        if (request.getActive() != null) {
            site.setActive(request.getActive());
        }
        if (request.getLatitude() != 0) {
            site.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != 0) {
            site.setLongitude(request.getLongitude());
        }

        site.setUpdatedAt(LocalDateTime.now());
        siteRepository.save(site);
        return mapToResponse(site);
    }

    // ── Manager deletes their site ────────────────────────────────────────────

    public void deleteSite(String siteId, String managerId) {
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));

        if (!site.getManagerId().equals(managerId)) {
            throw new RuntimeException("You can only delete your own sites");
        }

        siteRepository.delete(site);
    }

    // ── Tourist gets all active sites by location ─────────────────────────────

    public List<SiteResponse> getSitesByLocation(String locationId) {
        return siteRepository.findByLocationIdAndActiveTrue(locationId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Tourist searches sites by keyword ─────────────────────────────────────

    public List<SiteResponse> searchSites(String locationId, String keyword) {
        return siteRepository
                .findByLocationIdAndActiveTrueAndNameContainingIgnoreCase(
                        locationId, keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Tourist filters sites by category ────────────────────────────────────

    public List<SiteResponse> getSitesByCategory(String locationId,
                                                  String category) {
        return siteRepository
                .findByLocationIdAndActiveTrueAndCategory(locationId, category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get single site by ID ─────────────────────────────────────────────────

    public SiteResponse getSiteById(String siteId) {
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));
        return mapToResponse(site);
    }

    // ── Manager gets all their sites ──────────────────────────────────────────

    public List<SiteResponse> getMySites(String managerId) {
        return siteRepository.findByManagerId(managerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Analytics — increment view count ─────────────────────────────────────

    public void incrementViewCount(String siteId) {
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));
        site.setViewCount(site.getViewCount() + 1);
        siteRepository.save(site);
    }

    // ── Analytics — increment like count ─────────────────────────────────────

    public void incrementLikeCount(String siteId) {
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));
        site.setLikeCount(site.getLikeCount() + 1);
        siteRepository.save(site);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private SiteResponse mapToResponse(Site site) {
        return new SiteResponse(
                site.getId(),
                site.getName(),
                site.getDescription(),
                site.getShortDescription(),
                site.getLocationId(),
                site.getLocationName(),
                site.getManagerId(),
                site.getManagerName(),
                site.getCategory(),
                site.getAddress(),
                site.getOpeningHours(),
                site.getEntryFee(),
                site.getImageUrls(),
                site.getLatitude(),
                site.getLongitude(),
                site.isActive(),
                site.getViewCount(),
                site.getLikeCount(),
                site.getCreatedAt(),
                site.getUpdatedAt()
        );
    }
}