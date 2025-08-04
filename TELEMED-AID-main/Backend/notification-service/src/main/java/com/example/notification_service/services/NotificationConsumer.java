package com.example.notification_service.services;

import com.example.notification_service.DTO.NotificationMessage;
import com.example.notification_service.Repositories.NotificationRepository;
import com.example.notification_service.model.NotificationEntity;
import com.example.notification_service.model.NotificationType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "private-notifications-topic", groupId = "notification-service",
            containerFactory = "kafkaListenerContainerFactory")
    public void consumePrivate(String rawMessage) throws Exception {
        NotificationMessage msg = objectMapper.readValue(rawMessage, NotificationMessage.class);

        if (msg.getTargetId() == null) {
            throw new IllegalArgumentException("Private message must have targetId");
        }

        NotificationEntity entity = new NotificationEntity();
        entity.setType(String.valueOf(NotificationType.PRIVATE));
        entity.setTargetId(msg.getTargetId());
        entity.setMessage(msg.getMessage());

        repository.save(entity);
        System.out.println("Saved private message for " + msg.getTargetId());
    }
    @KafkaListener(topics = "public-notifications-topic", groupId = "notification-service",
            containerFactory = "kafkaListenerContainerFactory")
    public void consumePublic(String rawMessage) throws Exception {
        NotificationMessage msg = objectMapper.readValue(rawMessage, NotificationMessage.class);

        if (msg.getTargetId() == null) {
            throw new IllegalArgumentException("Public message must use targetId = DOCTOR or PATIENT");
        }

        NotificationType type = switch (msg.getTargetId().toUpperCase()) {
            case "DOCTOR" -> NotificationType.ALL_DOCTORS;
            case "PATIENT" -> NotificationType.ALL_PATIENTS;
            default -> throw new IllegalArgumentException("Invalid public targetId (must be DOCTOR or PATIENT)");
        };

        NotificationEntity entity = new NotificationEntity();
        entity.setType(String.valueOf(type));
        entity.setMessage(msg.getMessage());

        repository.save(entity);
        System.out.println("Saved public message for " + msg.getTargetId());
    }
}
