package com.telemidAid.patient_service.service;

import com.telemidAid.patient_service.dtos.CreatePatientRequest;
import com.telemidAid.patient_service.dtos.GetPatientRequest;
import com.telemidAid.patient_service.dtos.SimplifiedPatientDto;
import com.telemidAid.patient_service.dtos.UpdatePatientRequest;
import com.telemidAid.patient_service.entity.Patient;
import com.telemidAid.patient_service.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public void createPatient(CreatePatientRequest request) {
        Patient patient = Patient.builder()
                .userId(request.getUserId())
                .countryName(request.getCountryName())
                .countryId(request.getCountryId())
                .name(request.getName())
                .gender(request.getGender())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .build();

        patientRepository.save(patient);
    }
    @Transactional(readOnly = true)
    public GetPatientRequest getPatient(Long userId) {
        return patientRepository.findById(userId)
                .map(GetPatientRequest::toDto)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND,
                        "Patient with id " + userId + " not found"
                ));
    }
    // PatientService.java
    @Transactional(readOnly = true)
    public Map<Long, GetPatientRequest> getPatientsByIds(List<Long> userIds) {
        List<Patient> patients = patientRepository.findAllById(userIds);
        return patients.stream()
                .collect(Collectors.toMap(
                        Patient::getUserId,
                        GetPatientRequest::toDto
                ));
    }
    public boolean updatePatient(Long userId, UpdatePatientRequest request) {
        Optional<Patient> optionalPatient = patientRepository.findById(userId);
        if (optionalPatient.isEmpty()) {
            return false;
        }
        Patient patient = optionalPatient.get();
        patient.setName(request.getName());
        patient.setPhone(request.getPhone());

        patientRepository.save(patient);
        return true;
    }
    @Transactional(readOnly = true)
    public List<SimplifiedPatientDto> getAllSimplifiedDoctors() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(patient -> SimplifiedPatientDto.builder()
                        .userId(patient.getUserId())
                        .name(patient.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
