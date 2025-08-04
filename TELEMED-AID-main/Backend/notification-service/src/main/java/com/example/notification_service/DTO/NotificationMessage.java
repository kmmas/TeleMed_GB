package com.example.notification_service.DTO;


import lombok.Data;

@Data
public class NotificationMessage {
    private String targetId;
    private String message;
}