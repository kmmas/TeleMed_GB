package com.appointments.appointmentservice.Entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Entity
@Table(name = "make_appointment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @EmbeddedId
    private AppointmentID id;  // Embedded composite key

    @Column(name = "appointment_state", length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private AppointmentState appointmentState;
    @Column(name = "user_role", length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole userRole; // Added field to track user role
}
