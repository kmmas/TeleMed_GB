package com.appointments.appointmentservice.DTOs;

import com.appointments.appointmentservice.Entities.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDetailsDTO {
    private Long userId;
    private LocalDate date;
    private LocalTime time;
    private UserRole userRole;
}