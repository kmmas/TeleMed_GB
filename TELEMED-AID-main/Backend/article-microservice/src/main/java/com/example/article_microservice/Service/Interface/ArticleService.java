package com.example.article_microservice.Service.Interface;

import com.example.article_microservice.DTO.Article.ReceivedArticleDTO;
import org.springframework.http.ResponseEntity;

public interface ArticleService {
    ResponseEntity<?> publishArticle(ReceivedArticleDTO receivedArticleDTO);
    ResponseEntity<?> searchArticle(String term, int page, int size);
    ResponseEntity<?> getCertainArticle(Long id);
}
