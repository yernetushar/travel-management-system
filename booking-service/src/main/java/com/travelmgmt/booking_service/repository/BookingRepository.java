package com.travelmgmt.booking_service.repository;

import com.travelmgmt.booking_service.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Tourist — see all my bookings
    List<Booking> findByUserId(String userId);

    // Manager — see all bookings for their location
    List<Booking> findByLocationId(String locationId);

    // Manager — see bookings for a specific site
    List<Booking> findBySiteId(String siteId);

    // Check bookings by status
    List<Booking> findByUserIdAndStatus(String userId, String status);
}