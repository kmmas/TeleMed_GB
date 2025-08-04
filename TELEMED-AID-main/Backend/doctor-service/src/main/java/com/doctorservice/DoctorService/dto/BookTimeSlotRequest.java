package com.doctorservice.DoctorService.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
public class BookTimeSlotRequest {
    @NotNull
    private DayOfWeek day;

    @NotNull
    private LocalTime startTime;

    private boolean booked;
}