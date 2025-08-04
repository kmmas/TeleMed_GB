package com.doctorservice.DoctorService.repository;

import com.doctorservice.DoctorService.entity.CareerLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CareerLevelRepository extends JpaRepository<CareerLevel, Integer> {
    Optional<CareerLevel> findByCareerLevelName(String careerLevelName);
}