package com.doctorservice.DoctorService.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.util.List;

@Data
@Setter
@Getter
@Builder
public class DayAvailabilityRequest {
    @NotNull
    private DayOfWeek dayOfWeek;

    @NotEmpty
    private List<TimeSlotRequest> timeSlots;

    // Getters and setters
}
