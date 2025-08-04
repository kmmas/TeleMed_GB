package com.example.article_microservice.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorDTO {
    @NotNull(message = "No doctor national id is given")
    private Long id;
    @NotBlank(message = "Empty doctor name")
    private String name;
    @NotBlank(message = "Empty career level name")
    private String careerLevel;
    @NotBlank(message = "Empty specialization name")
    private String specializationName;
}
