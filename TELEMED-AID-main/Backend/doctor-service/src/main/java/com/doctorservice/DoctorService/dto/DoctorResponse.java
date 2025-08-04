package com.doctorservice.DoctorService.dto;

import com.doctorservice.DoctorService.entity.Doctor;
import lombok.Builder;
import lombok.Data;

import javax.print.Doc;
import java.sql.Date;

@Data
@Builder
public class DoctorResponse {
    private Long userId;
    private String name;
    private String phone;
    private Date birthDate;
    private String gender;
    private String countryName;
    private String countryId;
    private String careerLevel;
    private String specialization;

    public static DoctorResponse doctorToDoctorResponse(Doctor doctor){
        return DoctorResponse.builder()
                .userId(doctor.getUserId())
                .name(doctor.getName())
                .countryName(doctor.getCountryName())
                .countryId(doctor.getCountryId())
                .phone(doctor.getPhone())
                .birthDate(doctor.getBirthDate())
                .gender(doctor.getGender())
                .careerLevel(doctor.getCareerLevel().getCareerLevelName())
                .specialization(doctor.getSpecialization().getSpecializationName())
                .build();
    }
}