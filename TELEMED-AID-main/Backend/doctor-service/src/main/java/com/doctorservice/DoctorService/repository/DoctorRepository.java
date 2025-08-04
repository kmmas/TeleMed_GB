package com.doctorservice.DoctorService.repository;

import com.doctorservice.DoctorService.entity.Doctor;
import com.doctorservice.DoctorService.entity.DoctorAvailableDay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("SELECT DISTINCT d FROM Doctor d " +
            "LEFT JOIN FETCH d.specialization " +
            "LEFT JOIN FETCH d.careerLevel " +
            "WHERE (:specialization IS NULL OR LOWER(d.specialization.specializationName) LIKE LOWER(CONCAT('%', :specialization, '%'))) " +
            "AND (:name IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')))" +
            "AND (:careerLevel IS NULL OR LOWER(d.careerLevel.careerLevelName) LIKE LOWER(CONCAT('%', :careerLevel, '%'))) " +
            "AND (:availabilityDay IS NULL OR EXISTS (" +
            "    SELECT 1 FROM DoctorAvailableDay a WHERE a.doctor = d AND a.dayOfWeek = :availabilityDay)) " +
            "AND (:startTime IS NULL OR EXISTS (" +
            "    SELECT 1 FROM DoctorAvailableDay a JOIN a.timeSlots t " +
            "    WHERE a.doctor = d AND t.startTime = :startTime))")
    Page<Doctor> findDoctorsByCriteria(
            @Param("name") String name,
            @Param("specialization") String specialization,
            @Param("careerLevel") String careerLevel,
            @Param("availabilityDay") DayOfWeek availabilityDay,
            @Param("startTime") LocalTime startTime,
            Pageable pageable);

    @Query("SELECT a FROM DoctorAvailableDay a LEFT JOIN FETCH a.timeSlots WHERE a.doctor IN :doctors")
    List<DoctorAvailableDay> findAvailabilityWithTimeSlots(@Param("doctors") List<Doctor> doctors);
}