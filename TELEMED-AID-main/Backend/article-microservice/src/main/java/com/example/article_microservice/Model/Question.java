package com.example.article_microservice.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String patientWrittenName;
    @Column(columnDefinition = "TEXT")
    private String content;
    private Instant questionTime;
    private String title;
    @OneToMany(mappedBy = "question")
    private List<Comment> comments;
    public Question(String patientWrittenName, String title, String content, Instant questionTime) {
        this.patientWrittenName = patientWrittenName;
        this.title = title;
        this.content = content;
        this.questionTime = questionTime;
    }
}
