package com.telemidAid.patient_service.dtos;

import com.telemidAid.patient_service.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;


@Getter
@Setter
@AllArgsConstructor
public class GetPatientRequest {
    private Long userId;
    private String name;
    private String countryName;
    private String countryId;
    private String gender;
    private String phone;
    private Date birthDate;

    public static GetPatientRequest toDto(Patient patient) {
        return new GetPatientRequest(
                patient.getUserId(),
                patient.getName(),
                patient.getCountryName(),
                patient.getCountryId(),
                patient.getGender(),
                patient.getPhone(),
                patient.getBirthDate()
        );
    }
}