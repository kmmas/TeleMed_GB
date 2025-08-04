package com.appointments.appointmentservice.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserIdsByRoleDTO {
    private List<AppointmentDetailsDTO> patientAppointments;
    private List<AppointmentDetailsDTO> doctorAppointments;
}