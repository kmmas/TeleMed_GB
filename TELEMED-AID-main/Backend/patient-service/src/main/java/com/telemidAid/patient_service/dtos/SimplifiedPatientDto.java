package com.telemidAid.patient_service.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SimplifiedPatientDto {
    private Long userId;
    private String name;
}
