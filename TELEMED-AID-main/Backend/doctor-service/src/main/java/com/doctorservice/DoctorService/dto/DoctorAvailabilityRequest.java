package com.doctorservice.DoctorService.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorAvailabilityRequest {
    @NotEmpty
    private List<DayAvailabilityRequest> days;
}
