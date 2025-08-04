package com.doctorservice.DoctorService.dto;

import com.doctorservice.DoctorService.entity.CareerLevel;
import com.doctorservice.DoctorService.entity.Specialization;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CareerLevelDto {
    private String careerLevelName;

    public static CareerLevelDto toDto(CareerLevel careerLevel) {
        CareerLevelDto dto = new CareerLevelDto();
        dto.setCareerLevelName(careerLevel.getCareerLevelName());
        return dto;
    }
}
