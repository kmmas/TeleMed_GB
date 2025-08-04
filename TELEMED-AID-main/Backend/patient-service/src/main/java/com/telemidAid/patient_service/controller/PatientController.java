package com.telemidAid.patient_service.controller;

import com.telemidAid.patient_service.dtos.CreatePatientRequest;
import com.telemidAid.patient_service.dtos.GetPatientRequest;
import com.telemidAid.patient_service.dtos.SimplifiedPatientDto;
import com.telemidAid.patient_service.dtos.UpdatePatientRequest;
import com.telemidAid.patient_service.service.PatientService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;
    @GetMapping("/get-patient/{userId}")
    public ResponseEntity<?> getPatient(@PathVariable Long userId) {
        try {
            GetPatientRequest patient = patientService.getPatient(userId);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient not found with ID: " + userId);
        }
    }
    // PatientController.java
    @PostMapping("/bulk")
    public ResponseEntity<Map<Long, GetPatientRequest>> getPatientsByIds(@RequestBody List<Long> userIds) {
        Map<Long, GetPatientRequest> patients = patientService.getPatientsByIds(userIds);
        return ResponseEntity.ok(patients);
    }
    @PostMapping("/create-patient")
    public ResponseEntity<?> createPatient(@RequestBody CreatePatientRequest request) {
        try {
            patientService.createPatient(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Patient profile created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        }
    }

    @PutMapping("/update-patient/{patientId}")
    public ResponseEntity<?> updatePatientInfo(
            @PathVariable Long patientId,
            @RequestBody UpdatePatientRequest request) {
        try {
            boolean updated = patientService.updatePatient(patientId, request);
            if (updated) {
                return ResponseEntity.ok("Patient information updated successfully.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient not found with ID: " + patientId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        }
    }
    @GetMapping("/simplified")
    public ResponseEntity<List<SimplifiedPatientDto>> getAllSimplifiedDoctors() {
        List<SimplifiedPatientDto> doctors = patientService.getAllSimplifiedDoctors();
        return ResponseEntity.ok(doctors);
    }
}
