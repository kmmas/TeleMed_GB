package com.example.notification_service.Controller;

import com.example.notification_service.Repositories.NotificationRepository;
import com.example.notification_service.model.NotificationEntity;
import com.example.notification_service.model.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationRepository repository;

    //Get private messages for a specific user
    @GetMapping("/private/{userId}")
    public List<NotificationEntity> getPrivateMessages(@PathVariable String userId) {
        return repository.findByTypeAndTargetId(NotificationType.PRIVATE, userId);
    }

    //Get public messages for doctors
    @GetMapping("/public/doctors")
    public List<NotificationEntity> getDoctorBroadcasts() {
        return repository.findByType(NotificationType.ALL_DOCTORS);
    }

    //Get public messages for patients
    @GetMapping("/public/patients")
    public List<NotificationEntity> getPatientBroadcasts() {
        return repository.findByType(NotificationType.ALL_PATIENTS);
    }
}
