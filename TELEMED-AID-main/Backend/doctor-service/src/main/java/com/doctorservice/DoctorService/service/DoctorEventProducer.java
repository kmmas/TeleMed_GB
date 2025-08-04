package com.doctorservice.DoctorService.service;

import lombok.RequiredArgsConstructor;
import telemedaid.common_dto.DTOs.KafkaEnricherDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorEventProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.doctor-events}")
    private String topic;

    public void sendDoctorEvent(KafkaEnricherDTO doctorDTO) {
        kafkaTemplate.send(topic, doctorDTO.getId().toString(), doctorDTO);
    }
}

