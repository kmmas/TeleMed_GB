package com.appointments.appointmentservice.Config;
import com.appointments.appointmentservice.DTOs.AppointmentResponseDTO;
import com.appointments.appointmentservice.DTOs.DoctorDataDTO;
import com.appointments.appointmentservice.Entities.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.MessageChannels;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.PollableChannel;

@Configuration
@EnableIntegration
@RequiredArgsConstructor
public class AppointmentEnrichmentFlowConfig {

    private final DoctorServiceClient doctorClient;          // OpenFeign proxy

    /* ───── Channels ───── */

    @Bean
    public MessageChannel apptIn() {
        return MessageChannels.direct().getObject();               // entry point
    }

    @Bean
    public MessageChannel doctorReq() {
        return MessageChannels.direct().getObject();               // to Doctor service
    }

    @Bean
    public PollableChannel apptOut() {
        return MessageChannels.queue().getObject();                // enriched reply
    }

    /* ───── Call Doctor service when a doctor id arrives on doctorReq ───── */
    @ServiceActivator(inputChannel = "doctorReq")
    public DoctorDataDTO doctorLookup(Long userId) {
        DoctorDataDTO doctorDataDTO = doctorClient.getDoctorById(userId);
        System.out.println("Doctor data: " + doctorDataDTO);
        return doctorDataDTO;
    }

    /* ───── Main Content-Enricher flow (no IntegrationFlows) ───── */
    @Bean
    public IntegrationFlow enrichAppointmentFlow() {
        return flow -> flow
                /* 0. start from the input channel */
                .channel(apptIn())

                /* 1. copy doctorId into a header for later use */
                .enrichHeaders(h -> h.headerExpression(
                        "doctorId", "payload.id.doctorId"))

                /* 2. convert Appointment → DTO without doctorDetails */
                .<Appointment, AppointmentResponseDTO>transform(appt ->
                        AppointmentResponseDTO.builder()
                                .date(appt.getId().getAppointmentDate())
                                .time(appt.getId().getAppointmentTime())
                                .state(appt.getAppointmentState())
                                .build())

                /* 3. enrich with doctor details via request/reply */
                .enrich(e -> e
                        .requestChannel(doctorReq())                 // call service
                        .requestPayload(m -> m.getHeaders().get("doctorId"))       // send id
                        .propertyExpression("doctorDetails", "payload")
                        .shouldClonePayload(true))                   // DTO stays mutable

                /* 4. send the enriched DTO to output channel */
                .channel(apptOut());
    }

    /* ───── Gateway for easy use from service layer ───── */
    @MessagingGateway
    public interface AppointmentEnrichmentGateway {
        /** Send **one** Appointment, receive enriched DTO */
        @Gateway(requestChannel = "apptIn", replyChannel = "apptOut")
        AppointmentResponseDTO enrich(Appointment appointment);
    }
}
