package com.example.article_microservice.Controller;

import com.example.article_microservice.DTO.Question.CommentDTO;
import com.example.article_microservice.DTO.DoctorDTO;
import com.example.article_microservice.DTO.Question.ReceivedQuestionDTO;
import com.example.article_microservice.DTO.Question.VoteDTO;
import com.example.article_microservice.Service.Interface.QuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/article/question")

public class QuestionController {
    @Autowired
    private QuestionService questionService;
    @PostMapping("/publishQuestion")
    public ResponseEntity<?> publishQuestion(@Valid @RequestBody ReceivedQuestionDTO questionDTO) {
        return questionService.postQuestion(questionDTO);
    }
    @GetMapping("/searchQuestion")
    public ResponseEntity<?> searchQuestion(@RequestParam String term,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "5") int size) {
        return questionService.searchQuestion(term, page, size);
    }
    @PostMapping("/commentQuestion")
    public ResponseEntity<?> commentOnQuestion(@Valid @RequestBody CommentDTO commentDTO) {
        return questionService.commentOnQuestion(commentDTO);
    }
    @GetMapping("/getOne")
    public ResponseEntity<?> getCommentsOnQuestion(@RequestParam Long questionId) {
        return questionService.getCommentsOnQuestion(questionId);
    }
    @PostMapping("/addVote")
    public ResponseEntity<?> addVote(@Valid @RequestBody VoteDTO voteDTO) {
        return questionService.addVoteToQuestion(voteDTO);
    }
}
