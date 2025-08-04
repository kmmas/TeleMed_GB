package com.example.ChatService.controller;

import com.example.ChatService.Service.RoomService;
import com.example.ChatService.dto.ChatMessageDto;
import com.example.ChatService.dto.SimpleMessageDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("/chat")
public class RoomWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RoomService roomService;

    @MessageMapping("/send")
    public void sendMessage(ChatMessageDto message) {
        try {
            SimpleMessageDto simpleMessageDto = roomService.sendMessage(message);
                messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), simpleMessageDto);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to broadcast message", e);
        }
    }
}
