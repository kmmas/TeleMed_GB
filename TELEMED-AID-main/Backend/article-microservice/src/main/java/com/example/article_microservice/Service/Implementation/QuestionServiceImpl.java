package com.example.article_microservice.Service.Implementation;

import com.example.article_microservice.DTO.Question.CommentDTO;
import com.example.article_microservice.DTO.Question.CommentResponseDTO;
import com.example.article_microservice.DTO.Question.QuestionDetailsResponseDTO;
import com.example.article_microservice.DTO.Question.QuestionSearchResponseDTO;
import com.example.article_microservice.DTO.Question.ReceivedQuestionDTO;
import com.example.article_microservice.DTO.Question.VoteDTO;
import com.example.article_microservice.Model.*;
import com.example.article_microservice.Repository.EnrichedDoctorRepository;
import com.example.article_microservice.Repository.CommentRepository;
import com.example.article_microservice.Repository.QuestionRepository;
import com.example.article_microservice.Repository.VoteRepository;
import com.example.article_microservice.Service.Interface.QuestionService;
import com.example.article_microservice.Service.NotificationProducerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final EnrichedDoctorRepository enrichedDoctorRepository;
    private final CommentRepository commentRepository;
    private final VoteRepository voteRepository;
    private final NotificationProducerService notificationProducerService;

    @Transactional
    @Override
    public ResponseEntity<?> postQuestion(ReceivedQuestionDTO questionDTO) {
        /*
            SRS: Publishing questions
            PATM: (PA_PHCF_P1)
        */

        Question question = new Question();
        question.setTitle(questionDTO.getTitle());
        question.setContent(questionDTO.getContent());
        question.setQuestionTime(questionDTO.getQuestionTime());
        question.setPatientWrittenName(questionDTO.getPatientWrittenName());

        try {
            questionRepository.save(question);
            String message = "A new question was posted: " + question.getTitle();
            notificationProducerService.sendPublicNotification("DOCTOR",message);
            return ResponseEntity.status(HttpStatus.CREATED).body("Question posted successfully");
        } catch (Exception e){
            return ResponseEntity.internalServerError().body("An unexpected error occurred. " +
                    "Please try again later.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> searchQuestion(String term, int page, int size){
        if (term == null || term.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Search term cannot be empty");
        }
        String cleanedTerm = term.trim();
        String tsQuery = Arrays.stream(cleanedTerm.split("\\..s+"))
                .filter(word -> word.length() > 1) // filter stop-words better
                .collect(Collectors.joining(" | "));

        if (tsQuery.isBlank()) {
            Page<QuestionSearchResponseDTO> emptyPage = new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), 0);
            return ResponseEntity.ok(emptyPage);
        }
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Question> resultPage = questionRepository.searchByRelevance(tsQuery, pageable);
            Page<QuestionSearchResponseDTO> responsePage = resultPage.map(QuestionSearchResponseDTO::new);
            return ResponseEntity.ok(responsePage);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Change the search terms to" +
                    " make them more distinctive and retry");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> commentOnQuestion(CommentDTO commentDTO) {
        Optional<EnrichedDoctor> enrichedDoctorOptional = enrichedDoctorRepository.findById(commentDTO.getDoctorId());
        if (enrichedDoctorOptional.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");

        Optional<Question> questionOptional = questionRepository.findById(commentDTO.getQuestionId());
        if (questionOptional.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found");

        try {
            Comment comment = new Comment();
            comment.setEnrichedDoctorId(enrichedDoctorOptional.get().getId());
            comment.setQuestion(questionOptional.get());
            comment.setContent(commentDTO.getContent());
            comment.setTime(commentDTO.getCommentTime());

            Comment response = commentRepository.save(comment);
            String doctorName = enrichedDoctorOptional.get().getName();
            String message = "Dr. " + doctorName + " commented on question: "+ comment.getQuestion().getTitle();
            notificationProducerService.sendPublicNotification("PATIENTS", message);
            CommentResponseDTO commentResponseDTO = new CommentResponseDTO(response.getId(), response.getContent(),
                    response.getTime(), enrichedDoctorOptional.get().getName(), enrichedDoctorOptional.get().getSpecializationName(),
                    enrichedDoctorOptional.get().getCareerLevel(),
                    0);

            return ResponseEntity.status(HttpStatus.CREATED).body(commentResponseDTO);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while saving comment, try again");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> getCommentsOnQuestion(Long questionId) {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if (questionOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found");
        }
        try {
            Question question = questionOptional.get();
            List<CommentResponseDTO> commentResponses = new ArrayList<>();

            for (Comment comment : question.getComments()) {
                int voteCount = comment.getVotes().stream()
                        .mapToInt(vote -> vote.getRank())
                        .sum();

                EnrichedDoctor enrichedDoctor = enrichedDoctorRepository.findById(comment.getEnrichedDoctorId()).get();
                CommentResponseDTO commentResponse = new CommentResponseDTO(
                        comment.getId(),
                        comment.getContent(),
                        comment.getTime(),
                        enrichedDoctor.getName(),
                        enrichedDoctor.getSpecializationName(),
                        enrichedDoctor.getCareerLevel(),
                        voteCount
                );
                commentResponses.add(commentResponse);
            }

            return ResponseEntity.ok().body(commentResponses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while retrieving comments, please retry");
        }
    }
    @Transactional
    public ResponseEntity<?> addVoteToQuestion(VoteDTO voteDTO) {
        try {
            Optional<Comment> commentOptional = commentRepository.findById(voteDTO.getCommentId());
            if (commentOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
            }
            Optional<EnrichedDoctor> enrichedDoctor = enrichedDoctorRepository.findById(voteDTO.getDoctorId());
            if (enrichedDoctor.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
            }

            VoteId voteId = new VoteId(voteDTO.getDoctorId(), voteDTO.getCommentId());
            Optional<Vote> voteExist = voteRepository.findById(voteId);

            int r;
            // If doctor revotes with the same option = he is cancelling his choice actually
            // Which means it's zero now
            if (voteExist.isPresent() && Objects.equals(voteDTO.getRank(), voteExist.get().getRank())) {
                r = 0;
            } else {
                r = voteDTO.getRank();
            }

            Vote vote = voteExist.orElseGet(Vote::new);
            vote.setVoteId(voteId);
            vote.setRank(r);
            vote.setComment(commentOptional.get());


            Vote savedVote = voteRepository.save(vote);

            Comment comm = commentOptional.get();

            int totalVotes = comm.getVotes().stream()
                    .mapToInt(Vote::getRank)
                    .sum();

            VoteDTO responseVoteDTO = new VoteDTO(
                    savedVote.getVoteId().getCommentId(),
                    savedVote.getVoteId().getDoctorId(),
                    totalVotes
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseVoteDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while adding your vote, please retry");
        }
    }

}
