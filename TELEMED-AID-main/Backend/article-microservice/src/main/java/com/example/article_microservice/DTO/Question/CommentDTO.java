package com.example.article_microservice.DTO.Question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
@Data
@AllArgsConstructor
public class CommentDTO {
    @NotNull(message = "No doctor national id is given")
    private Long doctorId;

    @NotBlank(message = "Empty comment")
    private String content;

    @NotNull(message = "No question ID given")
    private Long questionId;

    @NotNull(message = "No given time")
    private Instant commentTime;
}


