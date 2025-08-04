package com.doctorservice.DoctorService.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.sql.Date;

@Data
@Builder
@ToString
public class CreateDoctorRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Name is required")
    private String name;  // Changed from fullName to name

    @NotBlank(message = "Country name is required")
    private String countryName;  // Added new field

    @NotBlank(message = "Country ID is required")
    private String countryId;  // Added new field

    @NotBlank(message = "Gender is required")
    private String gender;  // Added new field

    @NotBlank(message = "Phone is required")
//    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone format")
    private String phone;  // Changed from phoneNumber to phone

    @NotNull(message = "Birth date is required")
    private Date birthDate;  // Added new field

    @NotBlank(message = "Career level name is required")
    private String careerLevelName;  // Changed from careerLevelId to careerLevelName

    @NotBlank(message = "Specialization name is required")
    private String specializationName;  // Changed from specializationId to specializationName
}