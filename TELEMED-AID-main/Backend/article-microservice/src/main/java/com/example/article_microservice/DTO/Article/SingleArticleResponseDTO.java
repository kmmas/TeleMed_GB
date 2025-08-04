package com.example.article_microservice.DTO.Article;

import com.example.article_microservice.Model.Article;
import com.example.article_microservice.Repository.EnrichedDoctorRepository;
import lombok.Data;

import java.time.Instant;
@Data
public class SingleArticleResponseDTO {
    private Long id;
    private String title;
    private String category;
    private String content; // Full preview
    private String doctorName;
    private String doctorCareerLevel;
    private String doctorSpecialization;
    private Instant articleTime;

    public SingleArticleResponseDTO(Article article) {
        this.id = article.getId();
        this.title = article.getTitle();
        this.category = article.getCategory();
        this.content = article.getContent();
        this.articleTime = article.getArticleTime();
    }

    public void enrichDoctorData(EnrichedDoctorRepository enrichedDoctorRepository, Long enrichedDoctorId) {
        enrichedDoctorRepository.findById(enrichedDoctorId)
                .ifPresent(doctor -> {
                    this.doctorName = doctor.getName();
                    this.doctorCareerLevel = doctor.getCareerLevel();
                    this.doctorSpecialization = doctor.getSpecializationName();
                });
    }
}

