package com.example.article_microservice.Repository;

import com.example.article_microservice.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Repository
public interface QuestionRepository extends
        JpaRepository<Question, Long> {
    @Query(value = """
        SELECT * FROM question
        WHERE search_vector @@ to_tsquery('english', :term)
        ORDER BY ts_rank(search_vector, to_tsquery('english', :term)) DESC
        """,
            countQuery = """
        SELECT count(*) FROM question
        WHERE search_vector @@ to_tsquery('english', :term)
        """,
            nativeQuery = true)
    Page<Question> searchByRelevance(@Param("term") String term, Pageable pageable);

}
