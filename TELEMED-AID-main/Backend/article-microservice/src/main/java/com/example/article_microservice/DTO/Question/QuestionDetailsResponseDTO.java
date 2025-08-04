package com.example.article_microservice.DTO.Question;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDetailsResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String patientWrittenName;
    private Instant questionTime;
    private List<CommentResponseDTO> comments;
}
