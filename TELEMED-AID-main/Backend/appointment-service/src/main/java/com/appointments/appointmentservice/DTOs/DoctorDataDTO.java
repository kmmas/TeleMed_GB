package com.appointments.appointmentservice.DTOs;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.sql.Date;

@Data
@Builder
@ToString
public class DoctorDataDTO {
    private Long userId;
    private String name;
    private String phone;
    private Date birthDate;
    private String gender;
    private String countryName;
    private String countryId;
    private String careerLevel;
    private String specialization;
}