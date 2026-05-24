package com.travelmgmt.image_service.repository;

import com.travelmgmt.image_service.model.ImageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends MongoRepository<ImageDocument, String> {

    // Get all images for a site
    List<ImageDocument> findBySiteId(String siteId);

    // Get all images uploaded by a manager
    List<ImageDocument> findByUploadedBy(String managerId);

    // Get all images for a location
    List<ImageDocument> findByLocationId(String locationId);

    // Delete all images for a site
    void deleteBySiteId(String siteId);
}