package com.appointments.appointmentservice.Service;

import com.appointments.appointmentservice.Entities.Appointment;
import com.appointments.appointmentservice.Entities.AppointmentID;
import com.appointments.appointmentservice.Entities.AppointmentState;
import com.appointments.appointmentservice.Repositories.MakeAppointment;
import com.appointments.appointmentservice.Entities.UserRole;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
// ... existing imports ...

@Service
@RequiredArgsConstructor
public class BookAppointment {
    private final MakeAppointment appointmentRepository;

    @Transactional
    public boolean bookAppointment(Long userID, Long doctorID, LocalDate date, LocalTime time, UserRole userRole) {
        if (userID == null || doctorID == null || date == null || time == null || userRole == null) {
            return false;
        }
        if (date.isBefore(LocalDate.now()) || (date.isEqual(LocalDate.now()) && time.isBefore(LocalTime.now()))) {
            return false;
        }

        AppointmentID appointmentID = new AppointmentID(userID, doctorID, date, time);

        if (appointmentRepository.existsById(appointmentID)) {
            System.out.println("already exist");
            return false;
        }
        try {
            System.out.println("I will book appointment");
            Appointment appointment = Appointment.builder()
                    .id(appointmentID)
                    .appointmentState(AppointmentState.PENDING)
                    .userRole(userRole) // Set the user role
                    .build();
            appointmentRepository.save(appointment);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}