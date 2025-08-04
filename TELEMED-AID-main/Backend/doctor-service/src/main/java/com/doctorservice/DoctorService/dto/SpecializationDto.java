package com.doctorservice.DoctorService.dto;

import com.doctorservice.DoctorService.entity.Specialization;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SpecializationDto {
    private String specializationName;

    public static SpecializationDto toDto(Specialization specialization) {
        SpecializationDto dto = new SpecializationDto();
        dto.setSpecializationName(specialization.getSpecializationName());
        return dto;
    }
}
