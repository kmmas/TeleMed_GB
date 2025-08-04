package com.doctorservice.DoctorService.service;

import com.doctorservice.DoctorService.dto.*;
import com.doctorservice.DoctorService.entity.CareerLevel;
import com.doctorservice.DoctorService.entity.Doctor;
import com.doctorservice.DoctorService.entity.Specialization;
import com.doctorservice.DoctorService.exception.EntityNotFoundException;
import com.doctorservice.DoctorService.repository.CareerLevelRepository;
import com.doctorservice.DoctorService.repository.DoctorRepository;
import com.doctorservice.DoctorService.repository.SpecializationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private CareerLevelRepository careerLevelRepository;

    @Mock
    private SpecializationRepository specializationRepository;

    @Mock
    private DoctorEventProducer doctorEventProducer;

    @InjectMocks
    private DoctorService doctorService;

    @Test
    void doctorService_createDoctor_returnDoctorResponse() {
        // Given
        CreateDoctorRequest request = CreateDoctorRequest.builder()
                .userId(1L)
                .name("Mohamed Aly")
                .countryName("Egypt")
                .countryId("EGP")
                .phone("01551616660")
                .birthDate(Date.valueOf("2001-05-21"))
                .gender("MALE")
                .careerLevelName("SENIOR")
                .specializationName("CARDIOLOGY")
                .build();

        CareerLevel careerLevel = new CareerLevel(1, "SENIOR");
        Specialization specialization = new Specialization(1, "CARDIOLOGY");

        Doctor savedDoctor = Doctor.builder()
                .userId(1L)
                .name("Mohamed Aly")
                .countryName("Egypt")
                .countryId("EGP")
                .phone("01551616660")
                .birthDate(Date.valueOf("2001-05-21"))
                .gender("MALE")
                .careerLevel(careerLevel)
                .specialization(specialization)
                .build();

        when(careerLevelRepository.findByCareerLevelName("SENIOR"))
                .thenReturn(Optional.of(careerLevel));
        when(specializationRepository.findBySpecializationName("CARDIOLOGY"))
                .thenReturn(Optional.of(specialization));
        when(doctorRepository.save(any(Doctor.class)))
                .thenReturn(savedDoctor);

        // When
        DoctorResponse response = doctorService.createDoctor(request);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getUserId());
        assertEquals("Mohamed Aly", response.getName());
        verify(doctorRepository, times(1)).save(any(Doctor.class));
    }

    @Test
    void doctorService_updateDoctor_returnDoctorResponse() {
        // Given
        Long userId = 1L;
        DoctorUpdateRequest request = DoctorUpdateRequest.builder()
                .name("Ziad Aly")
                .phone("01201841997")
                .specialization("CARDIOLOGY") // Added to prevent NullPointerException
                .careerLevel("SENIOR") // Added if careerLevel also causes similar issue
                .build();

        Doctor existingDoctor = Doctor.builder()
                .userId(1L)
                .name("Mohamed Aly")
                .countryName("Egypt")
                .countryId("EGP")
                .phone("01551616660")
                .birthDate(Date.valueOf("2001-05-21"))
                .gender("MALE")
                .careerLevel(mock(CareerLevel.class))
                .specialization(mock(Specialization.class))
                .build();

        when(doctorRepository.findById(userId))
                .thenReturn(Optional.of(existingDoctor));
        when(doctorRepository.save(any(Doctor.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        // Mocking behavior for careerLevelRepository and specializationRepository
        // if the update method attempts to fetch them based on the request.
        when(careerLevelRepository.findByCareerLevelName(anyString())).thenReturn(Optional.of(mock(CareerLevel.class)));
        when(specializationRepository.findBySpecializationName(anyString())).thenReturn(Optional.of(mock(Specialization.class)));


        // When
        DoctorResponse response = doctorService.updateDoctor(userId, request);

        // Then
        assertEquals("Ziad Aly", response.getName());
        assertEquals("01201841997", response.getPhone());
        verify(doctorRepository, times(1)).save(existingDoctor);
        verify(doctorEventProducer, times(1)).sendDoctorEvent(any());

    }

    @Test
    void doctorService_updateDoctor_returnDoctorNotFound() {
        // Given
        Long userId = 2L;
        DoctorUpdateRequest request = DoctorUpdateRequest.builder()
                .name("Ziad Aly")
                .phone("01201841997")
                .build();
        when(doctorRepository.findById(userId))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> doctorService.updateDoctor(userId, request));
    }

    @Test
    void doctorService_getDoctor_returnDoctorResponse(){
        Doctor existingDoctor = Doctor.builder()
                .userId(1L)
                .name("Mohamed Aly")
                .countryName("Egypt")
                .countryId("EGP")
                .phone("01551616660")
                .birthDate(Date.valueOf("2001-05-21"))
                .gender("MALE")
                .careerLevel(mock(CareerLevel.class))
                .specialization(mock(Specialization.class))
                .build();
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(existingDoctor));
        DoctorResponse doctorResponse = doctorService.getDoctor(1L);
        assertNotNull(doctorResponse);
        assertEquals(1L, doctorResponse.getUserId());
        verify(doctorRepository, times(1)).findById(1L);
    }

    @Test
    void doctorService_getDoctor_throwException(){
        when(doctorRepository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> doctorService.getDoctor(2L));
    }

    @Test
    void doctorService_searchDoctors_returnPageResponse(){
        DoctorSearchRequest doctorSearchRequest = DoctorSearchRequest.builder()
                .name("Mohamed")
                .build();
        Doctor doctor = Doctor.builder()
                .userId(1L)
                .name("Mohamed Aly")
                .countryName("Egypt")
                .countryId("EGP")
                .phone("01551616660")
                .birthDate(Date.valueOf("2001-05-21"))
                .gender("MALE")
                .careerLevel(mock(CareerLevel.class))
                .specialization(mock(Specialization.class))
                .build();
        Page<Doctor> doctorPage = new PageImpl<>(List.of(doctor));
        when(doctorRepository.findDoctorsByCriteria(
                eq(doctorSearchRequest.getName())
                ,any()
                ,any()
                ,any()
                ,any()
                ,any(Pageable.class)
        )).thenReturn(doctorPage);

        PageResponse<DoctorSearchResponse> response =
                doctorService.searchDoctors(doctorSearchRequest, 0, 10);

        // Then
        assertEquals(1, response.getContent().size());
        assertEquals("Mohamed Aly", response.getContent().get(0).getName());
    }

    @Test
    void doctorService_setDoctorAvailability_success(){
        DoctorAvailabilityRequest doctorAvailabilityRequest = DoctorAvailabilityRequest.builder()
                .days(List.of(DayAvailabilityRequest.builder()
                                .dayOfWeek(DayOfWeek.valueOf("MONDAY"))
                                .timeSlots(List.of(new TimeSlotRequest(LocalTime.of(9, 0), (byte) 30)))
                        .build()))
                .build();

        Doctor existingDoctor = Doctor.builder()
                .userId(1L)
                .name("Mohamed Aly")
                .countryName("Egypt")
                .countryId("EGP")
                .phone("01551616660")
                .birthDate(Date.valueOf("2001-05-21"))
                .gender("MALE")
                .careerLevel(mock(CareerLevel.class))
                .specialization(mock(Specialization.class))
                .availableDays(new ArrayList<>())
                .build();

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(existingDoctor));
        doctorService.setDoctorAvailability(1L,doctorAvailabilityRequest);

        assertEquals("MONDAY", existingDoctor.getAvailableDays().get(0).getDayOfWeek().name());
        verify(doctorRepository, times(1)).save(existingDoctor);

    }
}

