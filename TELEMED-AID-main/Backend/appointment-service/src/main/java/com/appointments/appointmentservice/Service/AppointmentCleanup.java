package com.appointments.appointmentservice.Service;

import com.appointments.appointmentservice.Entities.AppointmentState;
import com.appointments.appointmentservice.Entities.AppointmentID;
import com.appointments.appointmentservice.Repositories.MakeAppointment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalTime;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j  // Using Lombok for logging
public class AppointmentCleanup {
    private final MakeAppointment appointmentRepository;

    @Scheduled(cron = "0 0 1 * * ?") // Runs daily at 1 AM
    @Transactional
    public int updateAppointmentsToCompleted() {
        try {
            int updatedCount = appointmentRepository.updateAppointmentStateByDateBefore(
                    AppointmentState.PENDING,
                    AppointmentState.COMPLETED,
                    LocalDate.now()
            );

            if (updatedCount > 0) {
                log.info("Successfully updated {} appointments to COMPLETED status", updatedCount);
            } else {
                log.debug("No appointments needed updating");
            }
            return updatedCount;

        } catch (Exception e) {
            log.error("Failed to update appointments to COMPLETED status", e);
            throw new RuntimeException("Failed to update appointment statuses", e);
        }
    }

    @Transactional
    public boolean completeAppointment(Long userId, Long doctorId, LocalDate date, LocalTime time) {
        try {
            int updatedRows = appointmentRepository.completeAppointment(userId, doctorId, date, time);
            return updatedRows > 0;  // Return true if any rows were updated
        } catch (Exception e) {
            log.error("Error completing appointment", e);
            return false;
        }
    }
}