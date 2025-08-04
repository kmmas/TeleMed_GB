package com.example.article_microservice.Service.Implementation;


import telemedaid.common_dto.DTOs.KafkaEnricherDTO;
import com.example.article_microservice.Model.EnrichedDoctor;
import com.example.article_microservice.Repository.EnrichedDoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class DoctorEventConsumer {

    @Autowired
    private EnrichedDoctorRepository enrichedDoctorRepository;

    @KafkaListener(topics = "${kafka.topic.doctor-events}", groupId = "article-service-group")
    public void handleDoctorEvent(KafkaEnricherDTO doctorDTO) {
        System.out.println("Received doctor event: " + doctorDTO);

        EnrichedDoctor enrichedDoctor = new EnrichedDoctor(
                doctorDTO.getId(),
                doctorDTO.getName(),
                doctorDTO.getCareerLevel(),
                doctorDTO.getSpecializationName()
        );

        enrichedDoctorRepository.save(enrichedDoctor);
    }
}

