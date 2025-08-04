package com.example.article_microservice.DTO.Article;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.Instant;

@Data
public class ReceivedArticleDTO {
    @NotBlank(message = "Please give the article a name")
    private String title;
    @NotBlank(message = "Please assign the article a category")
    private String category;
    @NotBlank(message = "Empty article, cannot be published")
    private String content;
    @NotNull(message = "Please right your ID")
    private Long doctorId;
    @NotNull(message = "Please give a time")
    private Instant articleTime;
}
