package com.example.article_microservice.Controller;

import com.example.article_microservice.DTO.Article.ReceivedArticleDTO;
import com.example.article_microservice.Service.Interface.ArticleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/article/article")
public class ArticleController {
    @Autowired
    ArticleService articleService;

    @PostMapping("/publishArticle")
    public ResponseEntity<?> publishArticle(@Valid @RequestBody ReceivedArticleDTO receivedArticleDTO) {
        return articleService.publishArticle(receivedArticleDTO);
    }

    @GetMapping("/searchArticle")
    public ResponseEntity<?> searchArticles(@RequestParam String term,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "5") int size) {
        return articleService.searchArticle(term, page, size);
    }

    @GetMapping("/getOne/{id}")
    public ResponseEntity<?> getCertainArticle(@PathVariable Long id) {
        return articleService.getCertainArticle(id);
    }

}
