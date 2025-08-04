package com.example.article_microservice.Repository;

import com.example.article_microservice.Model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface ArticleRepository extends
        JpaRepository<Article, Long> {
    @Query(value = """
        SELECT * FROM article
        WHERE search_vector @@ to_tsquery('english', :term)
        ORDER BY ts_rank(search_vector, to_tsquery('english', :term)) DESC
        """,
            countQuery = """
        SELECT count(*) FROM article
        WHERE search_vector @@ to_tsquery('english', :term)
        """,
            nativeQuery = true) // @Param prevents SQL Injection attack
    Page<Article> searchByRelevance(@Param("term") String term, Pageable pageable);

}
