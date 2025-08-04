package com.doctorservice.DoctorService.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "time_slot")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "day_id", nullable = false)
    private DoctorAvailableDay availableDay;

    private LocalTime startTime;

    @Max(value = 6, message = "Duration cannot exceed 6 hours")
    private Byte duration;
    @Builder.Default
    private boolean booked = false; // New field
}