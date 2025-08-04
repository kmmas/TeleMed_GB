package com.example.ChatService.controller;

import com.example.ChatService.Service.RoomService;
import com.example.ChatService.dto.JoinRoomDto;
import com.example.ChatService.dto.RoomCreationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/chat")
public class RoomRestController {

    @Autowired
    RoomService roomService;

    @PostMapping("/create-room")
    public ResponseEntity<?> createNewRoom(@RequestBody RoomCreationDto roomCreationDto) {
        long roomId = roomService.createNewRoom(roomCreationDto);
        return ResponseEntity.ok(Map.of("roomId", roomId));
    }

    @GetMapping("/rooms/{userId}")
    public ResponseEntity<?> getAllRoomsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(roomService.getAllRoomForUser(userId));
    }

    @PostMapping("/join-room")
    public ResponseEntity<?> joinRoom(@RequestBody JoinRoomDto joinRoomDto) {
        if (roomService.joinRoom(joinRoomDto)) {
            return ResponseEntity.ok("User joined the room successfully");
        } else {
            return ResponseEntity.ok("User Cannot join the room");
        }
    }

    @GetMapping("/messages/{roomId}")
    public ResponseEntity<?> getAllRoomMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getAllRoomMessages(roomId));
    }

}
