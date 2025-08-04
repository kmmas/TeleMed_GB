package com.appointments.appointmentservice.DTOs;
import com.appointments.appointmentservice.Entities.AppointmentState;
import com.appointments.appointmentservice.Entities.UserRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@ToString
public class MakeAppointmentDTO {
    private Long userId;
    private Long doctorId;
    private LocalDate date;
    private LocalTime time;
    private AppointmentState state;
    private UserRole userRole ;
}
