package com.example.article_microservice.DTO.Question;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private String content;
    private Instant time;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorCareerLevel;
    private int voteCount;
}

