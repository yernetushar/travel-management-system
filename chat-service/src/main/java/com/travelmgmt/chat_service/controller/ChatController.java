package com.travelmgmt.chat_service.controller;

import com.travelmgmt.chat_service.dto.ChatMessageRequest;
import com.travelmgmt.chat_service.dto.ChatMessageResponse;
import com.travelmgmt.chat_service.service.ChatService;
import com.travelmgmt.chat_service.util.JwtUtil;
import com.travelmgmt.chat_service.websocket.ChatWebSocketHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final JwtUtil jwtUtil;
    private final ChatWebSocketHandler webSocketHandler;

    public ChatController(ChatService chatService,
                          JwtUtil jwtUtil,
                          ChatWebSocketHandler webSocketHandler) {
        this.chatService = chatService;
        this.jwtUtil = jwtUtil;
        this.webSocketHandler = webSocketHandler;
    }

    // ── Send a message ────────────────────────────────────────────────────────

    @PostMapping("/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChatMessageRequest request) {

        String token      = authHeader.replace("Bearer ", "");
        String senderId   = jwtUtil.extractUserId(token);
        String senderName = jwtUtil.extractName(token);
        String senderRole = jwtUtil.extractRole(token);

        return ResponseEntity.ok(chatService.sendMessage(
                request, senderId, senderName, senderRole));
    }

    // ── Get conversation between two users ────────────────────────────────────

    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessageResponse>> getConversation(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String otherUserId,
            @RequestParam String locationId) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(chatService.getConversation(
                userId, otherUserId, locationId));
    }

    // ── Get all my conversations ──────────────────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<List<ChatMessageResponse>> getMyConversations(
            @RequestHeader("Authorization") String authHeader) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(chatService.getMyConversations(userId));
    }

    // ── Get unread messages ───────────────────────────────────────────────────

    @GetMapping("/unread")
    public ResponseEntity<List<ChatMessageResponse>> getUnreadMessages(
            @RequestHeader("Authorization") String authHeader) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(chatService.getUnreadMessages(userId));
    }

    // ── Mark conversation as read ─────────────────────────────────────────────

    @PutMapping("/read/{conversationId}")
    public ResponseEntity<String> markAsRead(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String conversationId) {

        String token  = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.extractUserId(token);

        chatService.markAsRead(conversationId, userId);
        return ResponseEntity.ok("Messages marked as read");
    }

    // ── Manager gets all messages for their location ──────────────────────────

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<ChatMessageResponse>> getLocationMessages(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String locationId) {

        return ResponseEntity.ok(
                chatService.getLocationMessages(locationId));
    }

    // ── Check if a user is online ─────────────────────────────────────────────

    @GetMapping("/online/{userId}")
    public ResponseEntity<Map<String, Boolean>> isUserOnline(
            @PathVariable String userId) {
        boolean online = webSocketHandler.isUserOnline(userId);
        return ResponseEntity.ok(Map.of("online", online));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("chat-service is running");
    }
}