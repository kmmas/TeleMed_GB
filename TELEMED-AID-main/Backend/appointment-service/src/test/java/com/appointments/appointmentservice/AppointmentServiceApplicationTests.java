package com.appointments.appointmentservice;

import com.appointments.appointmentservice.Config.AppointmentEnrichmentFlowConfig;
import com.appointments.appointmentservice.DTOs.AppointmentResponseDTO;
import com.appointments.appointmentservice.DTOs.DoctorDataDTO;
import com.appointments.appointmentservice.Entities.*;
import com.appointments.appointmentservice.Repositories.MakeAppointment;
import com.appointments.appointmentservice.Service.AppointmentCleanup;
import com.appointments.appointmentservice.Service.AppointmentQueryService;
import com.appointments.appointmentservice.Service.BookAppointment;
import com.appointments.appointmentservice.Service.CancelAppointment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class AppointmentServiceApplicationTests {

    private final Long userId = 123L;
    private final Long doctorId = 456L;
    private final LocalDate futureDate = LocalDate.now().plusDays(1);
    private final LocalTime appointmentTime = LocalTime.of(10, 0);

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAppointmentsByUserId() {
        MakeAppointment makeAppointment = mock(MakeAppointment.class);
        when(makeAppointment.findById_UserId(userId)).thenReturn(List.of(new Appointment(), new Appointment()));

        List<Appointment> result = makeAppointment.findById_UserId(userId);
        assertEquals(2, result.size());
    }

    @Test
    void testFindAppointmentsByDoctorId() {
        MakeAppointment makeAppointment = mock(MakeAppointment.class);
        when(makeAppointment.findById_DoctorId(doctorId)).thenReturn(List.of(new Appointment()));

        List<Appointment> result = makeAppointment.findById_DoctorId(doctorId);
        assertEquals(1, result.size());
    }


    @Test
    void shouldBookValidAppointment() {
        MakeAppointment makeAppointment = mock(MakeAppointment.class);
        BookAppointment bookAppointment = new BookAppointment(makeAppointment);
        when(makeAppointment.existsById(any())).thenReturn(false);

        boolean result = bookAppointment.bookAppointment(
                userId,
                doctorId,
                LocalDate.now(),
                LocalTime.now().plusHours(1),
                UserRole.PATIENT
        );

        assertTrue(result);
        verify(makeAppointment).save(any(Appointment.class));
    }

    /// TC-APP-2: Booking with Null Parameters
    @Test
    void shouldFailBookingWhenParamsAreNull() {
        MakeAppointment repo = mock(MakeAppointment.class);
        BookAppointment booker = new BookAppointment(repo);

        // Test each parameter being null, including UserRole
        assertFalse(booker.bookAppointment(null, doctorId, futureDate, appointmentTime, UserRole.PATIENT));
        assertFalse(booker.bookAppointment(userId, null, futureDate, appointmentTime, UserRole.PATIENT));
        assertFalse(booker.bookAppointment(userId, doctorId, null, appointmentTime, UserRole.PATIENT));
        assertFalse(booker.bookAppointment(userId, doctorId, futureDate, null, UserRole.PATIENT));
        assertFalse(booker.bookAppointment(userId, doctorId, futureDate, appointmentTime, null));
    }

    /// TC-APP-3: Booking in the Past
    @Test
    void shouldNotBookInPast() {
        MakeAppointment repo = mock(MakeAppointment.class);
        BookAppointment booker = new BookAppointment(repo);

        // Test past date with valid time
        assertFalse(booker.bookAppointment(
                userId,
                doctorId,
                LocalDate.now().minusDays(1),
                appointmentTime,
                UserRole.PATIENT  // Added UserRole parameter
        ));

        // Test current date with past time
        assertFalse(booker.bookAppointment(
                userId,
                doctorId,
                LocalDate.now(),
                LocalTime.now().minusHours(1),
                UserRole.PATIENT  // Added UserRole parameter
        ));

        verify(repo, never()).save(any());
    }

    /// TC-APP-4: Duplicate Appointment Booking
    @Test
    void shouldNotBookDuplicateAppointment() {
        // Setup - Use FIXED date/time instead of dynamic now()
        LocalDate testDate = LocalDate.of(2025, 7, 15); // Fixed future date
        LocalTime testTime = LocalTime.of(14, 30);      // Fixed time

        // Create the expected ID object
        AppointmentID expectedId = new AppointmentID(userId, doctorId, testDate, testTime);

        // Mock the repository
        MakeAppointment repo = mock(MakeAppointment.class);
        when(repo.existsById(expectedId)).thenReturn(true); // Duplicate exists

        // Test
        BookAppointment booker = new BookAppointment(repo);
        boolean result = booker.bookAppointment(
                userId,
                doctorId,
                testDate,      // Same date as in expectedId
                testTime,      // Same time as in expectedId
                UserRole.PATIENT
        );

        // Verify
        assertFalse(result);
        verify(repo).existsById(expectedId); // Verify exact ID was checked
        verify(repo, never()).save(any());
    }

    /// TC-APP-5: Exception During Booking
    @Test
    void shouldHandleExceptionDuringBooking() {
        // Setup with fixed time values
        Long userId = 123L;
        Long doctorId = 456L;
        LocalDate date = LocalDate.now().plusDays(1); // Future date
        LocalTime time = LocalTime.now().plusHours(1); // Future time

        // Create mock repository
        MakeAppointment mockRepository = mock(MakeAppointment.class);
        BookAppointment booker = new BookAppointment(mockRepository);

        // Mock the repository behavior
        when(mockRepository.existsById(any())).thenReturn(false); // No duplicate
        doThrow(new RuntimeException("DB error"))
                .when(mockRepository)
                .save(any(Appointment.class));

        // Execute and verify exception
        boolean result = booker.bookAppointment(
                userId,
                doctorId,
                date,
                time,
                UserRole.PATIENT
        );

        // Verify
        assertFalse(result, "Should return false when save fails");
        verify(mockRepository).existsById(any());
        verify(mockRepository).save(any(Appointment.class));
    }

    /// TC-APP-6: Valid Appointment Cancellation
    @Test
    void shouldCancelValidAppointment() {
        MakeAppointment repo = mock(MakeAppointment.class);
        CancelAppointment canceler = new CancelAppointment(repo);

        // Create the appointment ID that will be checked
        AppointmentID appointmentId = new AppointmentID(userId, doctorId, futureDate, appointmentTime);

        // Mock the existence check to return true
        when(repo.existsById(appointmentId)).thenReturn(true);

        // Mock the delete operation to return 1 (success)
        when(repo.deleteAppointment(userId, doctorId, futureDate, appointmentTime)).thenReturn(1);

        boolean result = canceler.cancelAppointment(userId, doctorId, futureDate, appointmentTime);

        assertTrue(result);
        verify(repo).existsById(appointmentId);
        verify(repo).deleteAppointment(userId, doctorId, futureDate, appointmentTime);
    }
    /// TC-APP-7: Retrieve Appointments for Patient
    @Test
    void shouldRetrieveAppointmentsForPatient() {
        AppointmentID id = new AppointmentID(userId, doctorId, LocalDate.now(), appointmentTime);
        Appointment appt = Appointment.builder().id(id).appointmentState(AppointmentState.PENDING).build();
        AppointmentResponseDTO enrichedDto = AppointmentResponseDTO.builder()
                .doctorDetails(DoctorDataDTO.builder().name("Dr. John Doe").specialization("Cardiology").build())
                .date(id.getAppointmentDate())
                .time(id.getAppointmentTime())
                .state(AppointmentState.PENDING)
                .build();

        MakeAppointment repo = mock(MakeAppointment.class);
        AppointmentEnrichmentFlowConfig.AppointmentEnrichmentGateway enricher = mock(AppointmentEnrichmentFlowConfig.AppointmentEnrichmentGateway.class);

        when(repo.findById_UserId(userId)).thenReturn(List.of(appt));
        when(enricher.enrich(appt)).thenReturn(enrichedDto);

        AppointmentQueryService queryService = new AppointmentQueryService(repo, enricher);
        List<AppointmentResponseDTO> result = queryService.getAppointmentsForUser(userId, null);

        assertEquals(1, result.size());
        assertEquals("Dr. John Doe", result.get(0).getDoctorDetails().getName());
    }

    @Test
    void testGetAppointmentsForPatient_WithDoctorIdFilter() {
        MakeAppointment appointmentRepository = mock(MakeAppointment.class);
        Appointment appointment = mock(Appointment.class);
        AppointmentID appointmentID = new AppointmentID(userId, doctorId, futureDate, appointmentTime);
        DoctorDataDTO doctorDataDTO = DoctorDataDTO.builder().name("Dr. John Doe").specialization("Cardiology").build();
        Long doctorIdFilter = 456L;

        AppointmentEnrichmentFlowConfig.AppointmentEnrichmentGateway enricher = mock(AppointmentEnrichmentFlowConfig.AppointmentEnrichmentGateway.class);
        AppointmentResponseDTO enrichedDto = AppointmentResponseDTO.builder()
                .doctorDetails(doctorDataDTO)
                .date(futureDate)
                .time(appointmentTime)
                .state(AppointmentState.PENDING)
                .build();

        when(appointmentRepository.findById_UserIdAndId_DoctorId(userId, doctorIdFilter))
                .thenReturn(List.of(appointment));
        when(appointment.getId()).thenReturn(appointmentID);
        when(appointment.getAppointmentState()).thenReturn(AppointmentState.PENDING);
        when(enricher.enrich(appointment)).thenReturn(enrichedDto);

        AppointmentQueryService appointmentQueryService = new AppointmentQueryService(appointmentRepository, enricher);

        List<AppointmentResponseDTO> result = appointmentQueryService.getAppointmentsForUser(userId, doctorIdFilter);

        verify(appointmentRepository, times(1))
                .findById_UserIdAndId_DoctorId(userId, doctorIdFilter);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Dr. John Doe", result.get(0).getDoctorDetails().getName());
        assertEquals("Cardiology", result.get(0).getDoctorDetails().getSpecialization());
        assertEquals(futureDate, result.get(0).getDate());
        assertEquals(appointmentTime, result.get(0).getTime());
        assertEquals(AppointmentState.PENDING, result.get(0).getState());
    }

    @Test
    void cancelAppointment_NullParameters_ShouldReturnFalse() {
        MakeAppointment mockRepository = mock(MakeAppointment.class);
        CancelAppointment cancelAppointment = new CancelAppointment(mockRepository);

        assertFalse(cancelAppointment.cancelAppointment(null, 1L, LocalDate.now(), LocalTime.now()));
        assertFalse(cancelAppointment.cancelAppointment(123L, null, LocalDate.now(), LocalTime.now()));
        assertFalse(cancelAppointment.cancelAppointment(123L, 1L, null, LocalTime.now()));
        assertFalse(cancelAppointment.cancelAppointment(123L, 1L, LocalDate.now(), null));

        verifyNoInteractions(mockRepository);
    }

    @Test
    void cancelAppointment_RepositoryThrowsException_ShouldReturnFalse() {
        // Setup test data with fixed values
        Long userId = 123L;
        Long doctorId = 456L;
        LocalDate date = LocalDate.of(2023, 7, 15); // Fixed date
        LocalTime time = LocalTime.of(14, 30);      // Fixed time

        // Create mock repository
        MakeAppointment mockRepository = mock(MakeAppointment.class);
        CancelAppointment cancelAppointment = new CancelAppointment(mockRepository);

        // Create expected ID
        AppointmentID expectedId = new AppointmentID(userId, doctorId, date, time);

        // Mock repository behavior
        when(mockRepository.existsById(expectedId)).thenReturn(true);
        when(mockRepository.deleteAppointment(userId, doctorId, date, time))
                .thenThrow(new RuntimeException("DB error"));

        // Execute
        boolean result = cancelAppointment.cancelAppointment(userId, doctorId, date, time);

        // Verify
        assertFalse(result, "Should return false when repository throws exception");
        verify(mockRepository).existsById(expectedId);
        verify(mockRepository).deleteAppointment(userId, doctorId, date, time);
    }

    @Autowired
    private AppointmentCleanup appointmentCleanup;

    @MockitoBean
    private MakeAppointment makeAppointment;

    @Test
    void shouldUpdateOldAppointmentsToCompleted() {
        // Arrange
        int expectedUpdatedCount = 5;
        when(makeAppointment.updateAppointmentStateByDateBefore(
                AppointmentState.PENDING,
                AppointmentState.COMPLETED,
                LocalDate.now()
        )).thenReturn(expectedUpdatedCount);

        // Act
        int actualUpdatedCount = appointmentCleanup.updateAppointmentsToCompleted();

        // Assert
        assertEquals(expectedUpdatedCount, actualUpdatedCount);
        verify(makeAppointment).updateAppointmentStateByDateBefore(
                AppointmentState.PENDING,
                AppointmentState.COMPLETED,
                LocalDate.now()
        );
    }

    @Test
    void shouldHandleUpdateFailureGracefully() {
        // Arrange
        RuntimeException dbError = new RuntimeException("Database connection failed");
        when(makeAppointment.updateAppointmentStateByDateBefore(
                any(), any(), any()
        )).thenThrow(dbError);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            appointmentCleanup.updateAppointmentsToCompleted();
        });

        verify(makeAppointment).updateAppointmentStateByDateBefore(
                AppointmentState.PENDING,
                AppointmentState.COMPLETED,
                LocalDate.now()
        );
    }

}
