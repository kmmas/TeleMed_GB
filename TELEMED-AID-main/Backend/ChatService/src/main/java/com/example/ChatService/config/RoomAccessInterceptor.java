package com.example.ChatService.config;

import com.example.ChatService.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class RoomAccessInterceptor implements HandshakeInterceptor {

    @Autowired
    private RoomService roomService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        System.out.println("Before handshake");
        if (request instanceof ServletServerHttpRequest servletRequest) {
            String chatId = servletRequest.getServletRequest().getParameter("roomId");
            String userId = servletRequest.getServletRequest().getParameter("userId");
            return roomService.isUserInRoom(Long.parseLong(userId), Long.parseLong(chatId));
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
