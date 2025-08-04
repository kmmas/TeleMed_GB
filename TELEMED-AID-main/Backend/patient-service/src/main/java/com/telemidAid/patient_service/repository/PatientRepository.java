package com.telemidAid.patient_service.repository;

import com.telemidAid.patient_service.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Override
    Optional<Patient> findById(Long s);
}