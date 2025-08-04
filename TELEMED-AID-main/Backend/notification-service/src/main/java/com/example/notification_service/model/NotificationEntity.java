package com.example.notification_service.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("notifications")
@Data
public class NotificationEntity {

    private String type; // PRIVATE, ALL_DOCTORS, ALL_PATIENTS
    private String targetId; // only for PRIVATE
    private String message;
    private long timestamp = System.currentTimeMillis();
}
