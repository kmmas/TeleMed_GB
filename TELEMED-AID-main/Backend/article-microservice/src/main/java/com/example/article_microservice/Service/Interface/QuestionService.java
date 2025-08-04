package com.example.article_microservice.Service.Interface;

import com.example.article_microservice.DTO.Question.CommentDTO;
import com.example.article_microservice.DTO.DoctorDTO;
import com.example.article_microservice.DTO.Question.ReceivedQuestionDTO;
import com.example.article_microservice.DTO.Question.VoteDTO;
import org.springframework.http.ResponseEntity;

public interface QuestionService {
    ResponseEntity<?> postQuestion(ReceivedQuestionDTO questionDTO);
    ResponseEntity<?> searchQuestion(String term, int page, int size);
    ResponseEntity<?> commentOnQuestion(CommentDTO commentDTO);
    ResponseEntity<?> getCommentsOnQuestion(Long id);
    ResponseEntity<?> addVoteToQuestion(VoteDTO voteDTO);
}
