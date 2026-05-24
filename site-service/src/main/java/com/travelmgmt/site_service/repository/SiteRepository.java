package com.travelmgmt.site_service.repository;

import com.travelmgmt.site_service.model.Site;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends MongoRepository<Site, String> {

    // Tourist — get all active sites for a location
    List<Site> findByLocationIdAndActiveTrue(String locationId);

    // Manager — get all sites they manage
    List<Site> findByManagerId(String managerId);

    // Manager — get all sites for their location (active + inactive)
    List<Site> findByLocationId(String locationId);

    // Search sites by name containing keyword
    List<Site> findByLocationIdAndActiveTrueAndNameContainingIgnoreCase(
            String locationId, String keyword);

    // Filter by category
    List<Site> findByLocationIdAndActiveTrueAndCategory(
            String locationId, String category);
}