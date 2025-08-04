package com.example.article_microservice.DTO.Article;

import com.example.article_microservice.Model.Article;
import com.example.article_microservice.Repository.EnrichedDoctorRepository;
import lombok.Data;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Data
public class ArticleSearchResponseDTO {
    private Long id;
    private String title;
    private String category;
    private String content;
    private String doctorName;
    private String doctorCareerLevel;
    private String doctorSpecialization;
    private String date;

    public ArticleSearchResponseDTO(Article article) {
        this.id = article.getId();
        this.title = article.getTitle();
        this.category = article.getCategory();
        this.content = article.getContent();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                .withZone(ZoneId.systemDefault());
        this.date = formatter.format(article.getArticleTime());
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


