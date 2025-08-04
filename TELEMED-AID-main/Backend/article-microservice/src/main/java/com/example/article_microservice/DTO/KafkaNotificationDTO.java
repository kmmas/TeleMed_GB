package com.example.article_microservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KafkaNotificationDTO {
    private String targetId;  // "DOCTOR", "PATIENT" for public
    private String message;
}