package com.example.article_microservice.Repository;

import com.example.article_microservice.Model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends
        JpaRepository<Comment, Long> {
    List<Comment> findAllByQuestionId(Long questionId);

}
