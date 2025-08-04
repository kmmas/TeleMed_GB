package com.doctorservice.DoctorService.repository;

import com.doctorservice.DoctorService.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpecializationRepository extends JpaRepository<Specialization, Integer> {
    Optional<Specialization> findBySpecializationName(String specializationName);
}