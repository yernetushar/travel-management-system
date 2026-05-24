package com.travelmgmt.booking_service.service;

import com.travelmgmt.booking_service.dto.BookingRequest;
import com.travelmgmt.booking_service.dto.BookingResponse;
import com.travelmgmt.booking_service.model.Booking;
import com.travelmgmt.booking_service.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Tourist books a site
    public BookingResponse createBooking(BookingRequest request,
                                         String userId,
                                         String userEmail,
                                         String userName) {

        if (request.getVisitDate() == null) {
            throw new RuntimeException("Visit date is required");
        }
        if (request.getNumberOfPeople() <= 0) {
            throw new RuntimeException("Number of people must be at least 1");
        }

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setUserEmail(userEmail);
        booking.setUserName(userName);
        booking.setSiteId(request.getSiteId());
        booking.setSiteName(request.getSiteName());
        booking.setLocationId(request.getLocationId());
        booking.setVisitDate(request.getVisitDate());
        booking.setNumberOfPeople(request.getNumberOfPeople());
        booking.setNotes(request.getNotes());
        booking.setStatus("PENDING");       // always starts as PENDING
        booking.setBookedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    // Tourist sees all their bookings
    public List<BookingResponse> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Manager sees all bookings for their location
    public List<BookingResponse> getBookingsByLocation(String locationId) {
        return bookingRepository.findByLocationId(locationId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Manager sees bookings for a specific site
    public List<BookingResponse> getBookingsBySite(String siteId) {
        return bookingRepository.findBySiteId(siteId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Manager confirms or cancels a booking
    public BookingResponse updateBookingStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!status.equals("CONFIRMED") && !status.equals("CANCELLED")) {
            throw new RuntimeException("Status must be CONFIRMED or CANCELLED");
        }

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    // Tourist cancels their own booking
    public BookingResponse cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    // Helper
    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUserId(),
                booking.getUserEmail(),
                booking.getUserName(),
                booking.getSiteId(),
                booking.getSiteName(),
                booking.getLocationId(),
                booking.getVisitDate(),
                booking.getNumberOfPeople(),
                booking.getStatus(),
                booking.getNotes(),
                booking.getBookedAt()
        );
    }
}