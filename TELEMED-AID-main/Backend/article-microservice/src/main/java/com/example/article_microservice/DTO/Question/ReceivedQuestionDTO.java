package com.example.article_microservice.DTO.Question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class ReceivedQuestionDTO {
    @NotBlank(message = "Please give a name to yourself even it's fake")
    private String patientWrittenName;
    @NotBlank(message = "Empty question")
    private String content;
    @NotBlank(message = "Empty title")
    private String title;
    @NotNull(message = "No given time")
    private Instant questionTime;
}
