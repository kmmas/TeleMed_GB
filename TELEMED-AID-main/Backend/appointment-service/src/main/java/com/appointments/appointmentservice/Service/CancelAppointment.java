package com.appointments.appointmentservice.Service;

import com.appointments.appointmentservice.Entities.AppointmentID;
import com.appointments.appointmentservice.Repositories.MakeAppointment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CancelAppointment {
    private final MakeAppointment appointmentRepository;

    public boolean cancelAppointment(Long userId, Long doctorId, LocalDate date, LocalTime time) {
        if (userId == null || doctorId == null || date == null || time == null) {
            log.warn("Invalid parameters for appointment cancellation");
            return false;
        }

        AppointmentID id = new AppointmentID(userId, doctorId, date, time);

        if (!appointmentRepository.existsById(id)) {
            log.warn("Appointment not found for ID: {}", id);
            return false;
        }

        try {
            int deleted = appointmentRepository.deleteAppointment(userId, doctorId, date, time);
            log.info("Appointment deleted successfully");
            return deleted > 0;
        } catch (Exception e) {
            log.error("Failed to delete appointment", e);
            return false;  // Changed from throw e to return false
        }
    }
}