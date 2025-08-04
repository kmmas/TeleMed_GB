package com.appointments.appointmentservice.Config;

import com.appointments.appointmentservice.DTOs.DoctorDataDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "doctor-service", url = "${doctor.service.url}")
public interface DoctorServiceClient {
//    @GetMapping("/doctor/availability")
//    ResponseEntity<String> getDoctors(@RequestBody CreatePatientRequest request);
@GetMapping("/api/doctor/{userId}")
DoctorDataDTO getDoctorById(@PathVariable("userId") Long userId);
}
