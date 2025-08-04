package com.telemidAid.patient_service.dtos;

import com.telemidAid.patient_service.entity.Patient;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePatientRequest {
    private String name;
    private String phone;

    public static UpdatePatientRequest toDto(Patient patient){
        return UpdatePatientRequest.builder()
                .name(patient.getName())
                .phone(patient.getPhone())
                .build();
    }
}
