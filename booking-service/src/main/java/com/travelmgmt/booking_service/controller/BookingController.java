package com.travelmgmt.booking_service.controller;

import com.travelmgmt.booking_service.dto.BookingRequest;
import com.travelmgmt.booking_service.dto.BookingResponse;
import com.travelmgmt.booking_service.service.BookingService;
import com.travelmgmt.booking_service.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final JwtUtil jwtUtil;

    public BookingController(BookingService bookingService, JwtUtil jwtUtil) {
        this.bookingService = bookingService;
        this.jwtUtil = jwtUtil;
    }

    // ── Tourist endpoints ─────────────────────────────────────────────────────

    // Tourist creates a booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody BookingRequest request) {

        String token = authHeader.replace("Bearer ", "");
        String userId   = jwtUtil.extractUserId(token);
        String email    = jwtUtil.extractEmail(token);
        String name     = jwtUtil.extractName(token);
        System.out.println("TOKEN RECEIVED: " + token);
        System.out.println("USER ID: " + userId);
        System.out.println("NAME: " + name);

        return ResponseEntity.ok(
                bookingService.createBooking(request, userId, email, name));
    }

    // Tourist sees their own bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @RequestHeader("Authorization") String authHeader) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    // Tourist cancels their own booking
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String bookingId) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(
                bookingService.cancelBooking(bookingId, userId));
    }

    // ── Manager endpoints ─────────────────────────────────────────────────────

    // Manager sees all bookings for their location
    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByLocation(
            @PathVariable String locationId) {
        return ResponseEntity.ok(
                bookingService.getBookingsByLocation(locationId));
    }

    // Manager sees bookings for a specific site
    @GetMapping("/site/{siteId}")
    public ResponseEntity<List<BookingResponse>> getBookingsBySite(
            @PathVariable String siteId) {
        return ResponseEntity.ok(
                bookingService.getBookingsBySite(siteId));
    }
    

    // Manager confirms or cancels a booking
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        return ResponseEntity.ok(
                bookingService.updateBookingStatus(bookingId, status));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("booking-service is running");
    }
}