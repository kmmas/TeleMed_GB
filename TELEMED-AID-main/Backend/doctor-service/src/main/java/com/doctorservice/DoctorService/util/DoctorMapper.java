package com.doctorservice.DoctorService.util;

import com.doctorservice.DoctorService.entity.Doctor;
import telemedaid.common_dto.DTOs.KafkaEnricherDTO;
public class DoctorMapper {
    public static KafkaEnricherDTO toDoctorDTO(Doctor doctor) {
        if (doctor == null) return null;

        return new KafkaEnricherDTO(
                doctor.getUserId(),
                doctor.getName(),
                doctor.getCareerLevel() != null ? doctor.getCareerLevel().getCareerLevelName() : null,
                doctor.getSpecialization() != null ? doctor.getSpecialization().getSpecializationName() : null
        );
    }
}
