package com.appointments.appointmentservice.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.*;
import java.util.Objects;
@Embeddable
@Getter
@Setter
@ToString
public class AppointmentID implements Serializable {
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    // Default constructor required by JPA
    public AppointmentID() {}

    public AppointmentID(Long userId, Long doctorId, LocalDate appointmentDate, LocalTime appointmentTime) {
        this.userId = userId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
    }

    // Getters and setters
    // equals() and hashCode() implementations
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AppointmentID that = (AppointmentID) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(doctorId, that.doctorId) &&
                Objects.equals(appointmentDate, that.appointmentDate) &&
                Objects.equals(appointmentTime, that.appointmentTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, doctorId, appointmentDate, appointmentTime);
    }
}