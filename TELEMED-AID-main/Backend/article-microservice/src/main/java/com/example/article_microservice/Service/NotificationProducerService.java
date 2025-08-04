package com.example.article_microservice.Service;

import com.example.article_microservice.DTO.KafkaNotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducerService {

    private final KafkaTemplate<String, KafkaNotificationDTO> kafkaTemplate;

    private static final String PUBLIC_TOPIC = "public-notifications-topic";

    public void sendPublicNotification(String targetId,String message) {
        KafkaNotificationDTO dto = new KafkaNotificationDTO(targetId, message);
        try {
            kafkaTemplate.send(PUBLIC_TOPIC, dto);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        System.out.println("Sent Kafka public notification: " + dto.getMessage());
    }
}
