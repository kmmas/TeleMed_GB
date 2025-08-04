package com.example.article_microservice.Service.Implementation;

import com.example.article_microservice.DTO.Article.ReceivedArticleDTO;
import com.example.article_microservice.DTO.Article.ArticleSearchResponseDTO;
import com.example.article_microservice.DTO.Article.SingleArticleResponseDTO;
import com.example.article_microservice.DTO.Question.QuestionSearchResponseDTO;
import com.example.article_microservice.Model.Article;
import com.example.article_microservice.Model.EnrichedDoctor;
import com.example.article_microservice.Repository.EnrichedDoctorRepository;
import com.example.article_microservice.Service.NotificationProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.example.article_microservice.Repository.ArticleRepository;
import com.example.article_microservice.Service.Interface.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final EnrichedDoctorRepository enrichedDoctorRepository;
    private final NotificationProducerService notificationProducerService;

    @Transactional
    public ResponseEntity<?> publishArticle(ReceivedArticleDTO receivedArticleDTO) {
        Article article = new Article();
        article.setTitle(receivedArticleDTO.getTitle());
        article.setContent(receivedArticleDTO.getContent());
        article.setArticleTime(receivedArticleDTO.getArticleTime());
        article.setCategory(receivedArticleDTO.getCategory());

        Optional<EnrichedDoctor> doctorOptional = enrichedDoctorRepository.findById(receivedArticleDTO.getDoctorId());
        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        }

        article.setEnrichedDoctorId(doctorOptional.get().getId());

        try {
            articleRepository.save(article);
            String message = "A new article was published: " + article.getTitle();
            notificationProducerService.sendPublicNotification("PATIENT", message);
            return ResponseEntity.status(HttpStatus.CREATED).body("Article saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while saving article, try again");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> searchArticle(String term, int page, int size) {
        if (term == null || term.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Search term cannot be empty");
        }

        String cleanedTerm = term.trim();
        String tsQuery = Arrays.stream(cleanedTerm.split("\\s+"))
                .filter(word -> word.length() > 1)
                .collect(Collectors.joining(" | "));

        if (tsQuery.isBlank()) {
            Page<ArticleSearchResponseDTO> emptyPage = new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), 0);
            return ResponseEntity.ok(emptyPage);
        }

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Article> resultPage = articleRepository.searchByRelevance(tsQuery, pageable);

            Page<ArticleSearchResponseDTO> responsePage = resultPage.map(article -> {
                ArticleSearchResponseDTO dto = new ArticleSearchResponseDTO(article);
                dto.enrichDoctorData(enrichedDoctorRepository, article.getEnrichedDoctorId());
                return dto;
            });

            return ResponseEntity.ok(responsePage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Change the search terms to make them more distinctive and retry");
        }
    }

    @Transactional
    public ResponseEntity<?> getCertainArticle(Long id) {
        if (id < 0) {
            return ResponseEntity.badRequest().body("id cannot be negative");
        }

        try {
            Optional<Article> article = articleRepository.findById(id);
            if (article.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found");
            }

            SingleArticleResponseDTO dto = new SingleArticleResponseDTO(article.get());
            dto.enrichDoctorData(enrichedDoctorRepository, article.get().getEnrichedDoctorId());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace(); // helpful in dev
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Something wrong occurred, please try again");
        }
    }
}
