package com.doctorservice.DoctorService.controller;

import com.doctorservice.DoctorService.dto.*;
import com.doctorservice.DoctorService.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<?> createDoctor(
            @Valid @RequestBody CreateDoctorRequest request
    ) {
        System.out.println("Router sent the doctor data: " + request);
        DoctorResponse response = doctorService.createDoctor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }
    // DoctorController.java
    @PostMapping("/bulk")
    public ResponseEntity<Map<Long, DoctorResponse>> getDoctorsByIds(@RequestBody List<Long> userIds) {
        Map<Long, DoctorResponse> doctors = doctorService.getDoctorsByIds(userIds);
        return ResponseEntity.ok(doctors);
    }
    @GetMapping("/simplified")
    public ResponseEntity<List<SimplifiedDoctorDto>> getAllSimplifiedDoctors() {
        List<SimplifiedDoctorDto> doctors = doctorService.getAllSimplifiedDoctors();
        return ResponseEntity.ok(doctors);
    }
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateDoctor(
            @PathVariable Long userId,
            @Valid @RequestBody DoctorUpdateRequest request) {
        return ResponseEntity.ok(doctorService.updateDoctor(userId, request));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long userId) {
        return ResponseEntity.ok(doctorService.getDoctor(userId));
    }
    @PostMapping("/{userId}/availability")
    public ResponseEntity<?> setDoctorAvailability(
            @PathVariable Long userId,
            @Valid @RequestBody DoctorAvailabilityRequest request) throws Exception {

        doctorService.setDoctorAvailability(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<DoctorSearchResponse>> searchDoctors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String careerLevel,
            @RequestParam(required = false) DayOfWeek availabilityDay,
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime startTime,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        DoctorSearchRequest request = DoctorSearchRequest.builder()
                .name(name)
                .specialization(specialization)
                .careerLevel(careerLevel)
                .availabilityDay(availabilityDay)
                .startTime(startTime)
                .build();

        PageResponse<DoctorSearchResponse> response = doctorService.searchDoctors(request, page, size);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/specialization")
    public List<SpecializationDto> getAllSpecializations() {
        return doctorService.getAllSpecializations();
    }
    @GetMapping("/career-level")
    public List<CareerLevelDto> getAllCareerLevels() {
        return doctorService.getAllCareerLevels();
    }
    @DeleteMapping("/{userId}/availability/{dayOfWeek}")
    public ResponseEntity<?> deleteDoctorAvailability(
            @PathVariable Long userId,
            @PathVariable DayOfWeek dayOfWeek) {

        doctorService.deleteDoctorAvailability(userId, dayOfWeek);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/availability")
    public ResponseEntity<List<DayAvailabilityResponse>> getDoctorAvailability(
            @PathVariable Long userId) {

        List<DayAvailabilityResponse> availability = doctorService.getDoctorAvailability(userId);
        return ResponseEntity.ok(availability);
    }
    @PostMapping("/{userId}/availability/book")
    public ResponseEntity<?> bookTimeSlot(
            @PathVariable Long userId,
            @Valid @RequestBody BookTimeSlotRequest request) {
        doctorService.bookTimeSlot(userId, request.getDay(), request.getStartTime(), request.isBooked());
        return ResponseEntity.ok().build();
    }
}