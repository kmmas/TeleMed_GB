package com.example.notification_service.Repositories;

import com.example.notification_service.model.NotificationEntity;
import com.example.notification_service.model.NotificationType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<NotificationEntity, String> {
    List<NotificationEntity> findByType(NotificationType type);
    List<NotificationEntity> findByTypeAndTargetId(NotificationType type, String targetId);
}