package com.telemidAid.patient_service.dtos;

import com.telemidAid.patient_service.entity.Patient;
import lombok.*;

import java.sql.Date;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatePatientRequest {
    private Long userId;
    private String name;
    private String countryName;
    private String countryId;
    private String phone;
    private Date birthDate;
    private String gender;


    public static CreatePatientRequest toDto(Patient patient){
        return CreatePatientRequest.builder()
                .userId(patient.getUserId())
                .name(patient.getName())
                .countryName(patient.getCountryName())
                .countryId(patient.getCountryId())
                .phone(patient.getPhone())
                .birthDate(patient.getBirthDate())
                .gender(patient.getGender())
                .build();
    }
}