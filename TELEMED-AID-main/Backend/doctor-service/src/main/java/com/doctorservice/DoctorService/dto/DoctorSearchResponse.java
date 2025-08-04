package com.doctorservice.DoctorService.dto;

import com.doctorservice.DoctorService.entity.Doctor;
import com.doctorservice.DoctorService.entity.DoctorAvailableDay;
import lombok.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSearchResponse {
    private Long userId;
    private String name;
    private String specialization;
    private String careerLevel;
    private String phone;
    private List<DayAvailabilityResponse> availability = new ArrayList<>();

    public static DoctorSearchResponse toDto(
            Doctor doctor,
            Map<Doctor, List<DoctorAvailableDay>> availabilityByDoctor
    ) {
        DoctorSearchResponse response = new DoctorSearchResponse();
        response.setUserId(doctor.getUserId());
        response.setName(doctor.getName());
        response.setPhone(doctor.getPhone());
        response.setSpecialization(doctor.getSpecialization().getSpecializationName());
        response.setCareerLevel(doctor.getCareerLevel().getCareerLevelName());

        List<DoctorAvailableDay> doctorAvailability = availabilityByDoctor.getOrDefault(
                doctor,
                Collections.emptyList()
        );

        response.setAvailability(
                doctorAvailability.stream()
                        .map(DayAvailabilityResponse::toDto)
                        .collect(Collectors.toList())
        );

        return response;
    }
}

