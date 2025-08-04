package com.appointments.appointmentservice.Service;

import com.appointments.appointmentservice.Config.AppointmentEnrichmentFlowConfig;
import com.appointments.appointmentservice.DTOs.AppointmentDetailsDTO;
import com.appointments.appointmentservice.DTOs.AppointmentResponseDTO;
import com.appointments.appointmentservice.DTOs.UserIdsByRoleDTO;
import com.appointments.appointmentservice.Entities.Appointment;
import com.appointments.appointmentservice.Entities.UserRole;
import com.appointments.appointmentservice.Repositories.MakeAppointment;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppointmentQueryService {

    private final MakeAppointment appointmentRepository;
    private final AppointmentEnrichmentFlowConfig.AppointmentEnrichmentGateway enricher;              // ⬅️ new gateway

    /**
     * Return all appointments for a user, optionally narrowed to one doctor,
     * already enriched with that doctor’s details.
     */
    public List<AppointmentResponseDTO> getAppointmentsForUser(
            Long userId, Long doctorIdFilter) {

        List<Appointment> appointments = (doctorIdFilter != null)
                ? appointmentRepository.findById_UserIdAndId_DoctorId(userId, doctorIdFilter)
                : appointmentRepository.findById_UserId(userId);

        // Delegate enrichment of EACH appointment to the Integration flow
        return appointments.stream()
                .map(enricher::enrich)
                .toList();
    }
    public long countAppointmentsWhereUserIsDoctor(Long userId) {
        return appointmentRepository.countByDoctorId(userId);
    }
    public UserIdsByRoleDTO getUserIdsByRoleForDoctorAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findById_DoctorId(doctorId);

        // Create lists of appointment details by role
        List<AppointmentDetailsDTO> patientAppointments = appointments.stream()
                .filter(appt -> appt.getUserRole() == UserRole.PATIENT)
                .map(appt -> new AppointmentDetailsDTO(
                        appt.getId().getUserId(),
                        appt.getId().getAppointmentDate(),
                        appt.getId().getAppointmentTime(),
                        UserRole.PATIENT))
                .collect(Collectors.toList());

        List<AppointmentDetailsDTO> doctorAppointments = appointments.stream()
                .filter(appt -> appt.getUserRole() == UserRole.DOCTOR)
                .map(appt -> new AppointmentDetailsDTO(
                        appt.getId().getUserId(),
                        appt.getId().getAppointmentDate(),
                        appt.getId().getAppointmentTime(),
                        UserRole.DOCTOR))
                .collect(Collectors.toList());

        return new UserIdsByRoleDTO(patientAppointments, doctorAppointments);
    }
}

