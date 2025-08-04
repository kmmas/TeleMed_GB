package com.appointments.appointmentservice.Repositories;

import com.appointments.appointmentservice.Entities.Appointment;
import com.appointments.appointmentservice.Entities.AppointmentID;
import com.appointments.appointmentservice.Entities.AppointmentState;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface MakeAppointment extends JpaRepository<Appointment, AppointmentID> {
    boolean existsById(@NonNull AppointmentID id);

    // Fixed derived query methods with proper underscore notation
    List<Appointment> findById_UserId(Long userId);
    List<Appointment> findById_DoctorId(Long doctorId);
    List<Appointment> findById_UserIdAndId_DoctorId(Long userId, Long doctorId);

    void deleteByAppointmentStateAndId_AppointmentDateBefore(AppointmentState state, LocalDate date);

    @Modifying
    @Query("UPDATE Appointment a SET a.appointmentState = :newState " +
            "WHERE a.appointmentState = :currentState AND a.id.appointmentDate < :currentDate")
    int updateAppointmentStateByDateBefore(
            @Param("currentState") AppointmentState currentState,
            @Param("newState") AppointmentState newState,
            @Param("currentDate") LocalDate currentDate);

    @Modifying
    @Query("DELETE FROM Appointment a " +
            "WHERE a.id.userId = :userId " +
            "AND a.id.doctorId = :doctorId " +
            "AND a.id.appointmentDate = :date " +
            "AND a.id.appointmentTime = :time")
    int deleteAppointment(
            @Param("userId") Long userId,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("time") LocalTime time);

    @Modifying
    @Query("UPDATE Appointment a SET a.appointmentState = 'COMPLETED' " +
            "WHERE a.id.userId = :userId " +
            "AND a.id.doctorId = :doctorId " +
            "AND a.id.appointmentDate = :date " +
            "AND a.id.appointmentTime = :time " +
            "AND a.appointmentState = 'PENDING'")  // Only update PENDING appointments
    int completeAppointment(
            @Param("userId") Long userId,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("time") LocalTime time);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.id.doctorId = :userId")
    long countByDoctorId(@Param("userId") Long userId);
}