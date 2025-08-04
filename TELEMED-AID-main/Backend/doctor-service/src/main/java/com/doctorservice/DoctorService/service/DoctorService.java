package com.doctorservice.DoctorService.service;

import com.doctorservice.DoctorService.dto.*;
import com.doctorservice.DoctorService.entity.*;
import com.doctorservice.DoctorService.exception.EntityNotFoundException;
import com.doctorservice.DoctorService.repository.CareerLevelRepository;
import com.doctorservice.DoctorService.repository.DoctorRepository;
import com.doctorservice.DoctorService.repository.SpecializationRepository;
import com.doctorservice.DoctorService.util.DoctorMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import telemedaid.common_dto.DTOs.KafkaEnricherDTO;
import java.time.DayOfWeek;
@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final CareerLevelRepository careerLevelRepository;
    private final SpecializationRepository specializationRepository;
    private final DoctorEventProducer doctorEventProducer;

    @Transactional
    public DoctorResponse createDoctor(CreateDoctorRequest request) {
        if(specializationRepository.findBySpecializationName(request.getSpecializationName()).isEmpty()) {
            Specialization specialization = new Specialization();
            specialization.setSpecializationName(request.getSpecializationName());
            specializationRepository.save(specialization);
        }
        if(careerLevelRepository.findByCareerLevelName(request.getCareerLevelName()).isEmpty()) {
            CareerLevel careerLevel = new CareerLevel();
            careerLevel.setCareerLevelName(request.getCareerLevelName());
            careerLevelRepository.save(careerLevel);
        }
        Doctor doctor = Doctor.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .countryName(request.getCountryName())
                .countryId(request.getCountryId())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .careerLevel(careerLevelRepository.findByCareerLevelName(request.getCareerLevelName()).orElse(null))
                .specialization(specializationRepository.findBySpecializationName(request.getSpecializationName()).orElse(null))
                .build();
        //     doctorEventProducer.sendDoctorEvent(doctorDTO);

        Doctor savedDoctor = doctorRepository.save(doctor);
        if(savedDoctor.getUserId() != null) {
            KafkaEnricherDTO kafkaEnricherDTO = DoctorMapper.toDoctorDTO(savedDoctor);
            doctorEventProducer.sendDoctorEvent(kafkaEnricherDTO);
        }

        return DoctorResponse.doctorToDoctorResponse(savedDoctor);
    }

    @Transactional
    public DoctorResponse updateDoctor(Long userId, DoctorUpdateRequest request) {
        Doctor doctor = doctorRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + userId));

        // Only update name and phone as per the simplified request
        if(!(request.getName().isEmpty())){
            doctor.setName(request.getName());
        }
        if(!(request.getPhone().isEmpty())){
            doctor.setPhone(request.getPhone());
        }
        // Update specialization if provided
        if (!request.getSpecialization().isEmpty()) {
            Specialization specialization = specializationRepository
                    .findBySpecializationName(request.getSpecialization())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Specialization not found with name: " + request.getSpecialization()));
            System.out.println("spec:"+specialization);
            doctor.setSpecialization(specialization);
        }

        // Update career level if provided
        if (!request.getCareerLevel().isEmpty()) {
            CareerLevel careerLevel = careerLevelRepository
                    .findByCareerLevelName(request.getCareerLevel())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Career level not found with name: " + request.getCareerLevel()));
            doctor.setCareerLevel(careerLevel);
        }
        Doctor updatedDoctor = doctorRepository.save(doctor);
        if(updatedDoctor.getUserId() != null) {
            KafkaEnricherDTO kafkaEnricherDTO = DoctorMapper.toDoctorDTO(updatedDoctor);
            doctorEventProducer.sendDoctorEvent(kafkaEnricherDTO);
        }


        return DoctorResponse.doctorToDoctorResponse(updatedDoctor);
    }
    @Transactional(readOnly = true)
    public List<DoctorResponse> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(DoctorResponse::doctorToDoctorResponse)
                .collect(Collectors.toList());
    }
    // DoctorService.java
    @Transactional(readOnly = true)
    public Map<Long, DoctorResponse> getDoctorsByIds(List<Long> userIds) {
        List<Doctor> doctors = doctorRepository.findAllById(userIds);
        return doctors.stream()
                .collect(Collectors.toMap(
                        Doctor::getUserId,
                        DoctorResponse::doctorToDoctorResponse
                ));
    }
    @Transactional(readOnly = true)
    public List<SimplifiedDoctorDto> getAllSimplifiedDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(doctor -> SimplifiedDoctorDto.builder()
                        .userId(doctor.getUserId())
                        .name(doctor.getName())
                        .specializationName(doctor.getSpecialization() != null ?
                                doctor.getSpecialization().getSpecializationName() : null)
                        .careerLevelName(doctor.getCareerLevel() != null ?
                                doctor.getCareerLevel().getCareerLevelName() : null)
                        .build())
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public DoctorResponse getDoctor(Long userId) {
        Doctor doctor = doctorRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + userId));
        return DoctorResponse.doctorToDoctorResponse(doctor);
    }

    public void setDoctorAvailability(Long userId, DoctorAvailabilityRequest request){
        Doctor doctor = doctorRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + userId));

        // Add new availability
        for (DayAvailabilityRequest dayRequest : request.getDays()) {
            DoctorAvailableDay availableDay = new DoctorAvailableDay();
            availableDay.setDayOfWeek(dayRequest.getDayOfWeek());
            availableDay.setDoctor(doctor);
            for (TimeSlotRequest slotRequest : dayRequest.getTimeSlots()) {
                TimeSlot timeSlot = TimeSlot.builder()
                        .availableDay(availableDay)
                        .duration(slotRequest.getDuration())
                        .startTime(slotRequest.getStartTime())
                        .build();
                availableDay.getTimeSlots().add(timeSlot);
            }

            doctor.getAvailableDays().add(availableDay);
        }

        doctorRepository.save(doctor);
    }

    @Transactional(readOnly = true)
    public PageResponse<DoctorSearchResponse> searchDoctors(DoctorSearchRequest request, int page, int size) {
        // First query - get doctors without availability details
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Doctor> doctorPage = doctorRepository.findDoctorsByCriteria(
                request.getName(),
                request.getSpecialization(),
                request.getCareerLevel(),
                request.getAvailabilityDay(),
                request.getStartTime(),
                pageable
        );

        // Second query - get availability for the found doctors
        List<DoctorAvailableDay> availability = doctorRepository.findAvailabilityWithTimeSlots(
                doctorPage.getContent()
        );

        // Group availability by doctor
        Map<Doctor, List<DoctorAvailableDay>> availabilityByDoctor = availability.stream()
                .collect(Collectors.groupingBy(DoctorAvailableDay::getDoctor));

        // Build response using helper function
        List<DoctorSearchResponse> content = doctorPage.getContent().stream()
                .map(doctor -> DoctorSearchResponse.toDto(doctor, availabilityByDoctor))
                .collect(Collectors.toList());

        return new PageResponse<>(new PageImpl<>(content, pageable, doctorPage.getTotalElements()));
    }
    public List<SpecializationDto> getAllSpecializations() {
        List<Specialization> specializations = specializationRepository.findAll();
        return specializations.stream()
                .map(SpecializationDto::toDto)
                .collect(Collectors.toList());
    }
    public List<CareerLevelDto> getAllCareerLevels() {
        List<CareerLevel> careerLevels = careerLevelRepository.findAll();
        return careerLevels.stream()
                .map(CareerLevelDto::toDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public void deleteDoctorAvailability(Long userId, DayOfWeek dayOfWeek) {
        Doctor doctor = doctorRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + userId));

        // Remove all available days matching the dayOfWeek
        doctor.getAvailableDays().removeIf(day -> day.getDayOfWeek() == dayOfWeek);
        doctorRepository.save(doctor);
    }

    @Transactional(readOnly = true)
    public List<DayAvailabilityResponse> getDoctorAvailability(Long userId) {
        Doctor doctor = doctorRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + userId));

        return doctor.getAvailableDays().stream()
                .map(DayAvailabilityResponse::toDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public void bookTimeSlot(Long doctorId, DayOfWeek day, LocalTime startTime, boolean booked) {
        // Verify the doctor exists
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));

        // Find the time slot by day and start time
        TimeSlot timeSlot = doctor.getAvailableDays().stream()
                .filter(dayAvailability -> dayAvailability.getDayOfWeek() == day)
                .flatMap(dayAvailability -> dayAvailability.getTimeSlots().stream())
                .filter(slot -> slot.getStartTime().equals(startTime))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Time slot not found for doctor %d on %s at %s",
                                doctorId, day, startTime)));

        timeSlot.setBooked(booked);
        doctorRepository.save(doctor);
    }
}