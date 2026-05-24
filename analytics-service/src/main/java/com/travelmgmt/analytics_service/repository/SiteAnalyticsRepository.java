package com.travelmgmt.analytics_service.repository;

import com.travelmgmt.analytics_service.model.SiteAnalytics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteAnalyticsRepository
        extends MongoRepository<SiteAnalytics, String> {

    Optional<SiteAnalytics> findBySiteId(String siteId);

    List<SiteAnalytics> findByLocationId(String locationId);
}