package com.doctorservice.DoctorService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SimplifiedDoctorDto {
    private Long userId;
    private String name;
    private String specializationName;
    private String careerLevelName;
}