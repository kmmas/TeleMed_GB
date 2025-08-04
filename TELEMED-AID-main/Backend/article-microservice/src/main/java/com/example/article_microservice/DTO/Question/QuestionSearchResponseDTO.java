package com.example.article_microservice.DTO.Question;

import com.example.article_microservice.Model.Article;
import com.example.article_microservice.Model.Question;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.Instant;

@Data
public class QuestionSearchResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String patientWrittenName;
    private Instant questionTime;

    public QuestionSearchResponseDTO(Question question) {
        this.id = question.getId();
        this.title = question.getTitle();
        this.patientWrittenName = question.getPatientWrittenName();
        this.content = question.getContent();
        this.questionTime = question.getQuestionTime();
    }
}