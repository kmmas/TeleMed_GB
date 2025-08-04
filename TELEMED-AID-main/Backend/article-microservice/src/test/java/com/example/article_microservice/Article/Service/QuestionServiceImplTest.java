package com.example.article_microservice.Article.Service;

import com.example.article_microservice.DTO.Article.ReceivedArticleDTO;
import com.example.article_microservice.DTO.Question.*;
import com.example.article_microservice.Model.*;
import com.example.article_microservice.Repository.*;
import com.example.article_microservice.Service.Implementation.ArticleServiceImpl;
import com.example.article_microservice.Service.Implementation.QuestionServiceImpl;
import com.example.article_microservice.Service.NotificationProducerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.*;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class QuestionServiceImplTest {

    @InjectMocks
    private QuestionServiceImpl questionService;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private EnrichedDoctorRepository enrichedDoctorRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private VoteRepository voteRepository;

    @Mock
    private NotificationProducerService notificationProducerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // TC-ART-11: Valid Question Posting Request
    @Test
    void testPublishArticle_ValidRequest_ReturnsCreated() {
        ReceivedQuestionDTO receivedQuestionDTO = new ReceivedQuestionDTO();
        receivedQuestionDTO.setPatientWrittenName("Ahmad");
        receivedQuestionDTO.setContent("Cardiology");
        receivedQuestionDTO.setTitle("Heart Health Tips");
        receivedQuestionDTO.setQuestionTime(Instant.parse("2025-05-08T10:15:00Z"));

        // Mock save to return the saved question (could be with id)
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = questionService.postQuestion(receivedQuestionDTO);

        assertEquals(201, response.getStatusCodeValue());
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    // TC-ART-12: Database Exception During Question Posting
    @Test
    void testPostQuestion_DatabaseException_ReturnsInternalServerError() {
        ReceivedQuestionDTO questionDTO = new ReceivedQuestionDTO();
        questionDTO.setTitle("Test Title");
        questionDTO.setContent("Test Content");
        questionDTO.setQuestionTime(Instant.now());
        questionDTO.setPatientWrittenName("John Doe");

        doThrow(new RuntimeException("DB Error")).when(questionRepository).save(any(Question.class));

        ResponseEntity<?> response = questionService.postQuestion(questionDTO);

        assertEquals(500, response.getStatusCodeValue());
        assertEquals("An unexpected error occurred. Please try again later.", response.getBody());
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    // TC-ART-13: Valid Question Search Request
    @Test
    void testSearchQuestion_ValidRequest_ReturnsPaginatedResults() {
        String searchTerm = "diabetes treatment";
        int page = 0;
        int size = 10;

        Question question1 = new Question();
        question1.setTitle("Diabetes Treatment Options");
        question1.setContent("Learn about the latest diabetes treatments");
        question1.setQuestionTime(Instant.now());
        question1.setPatientWrittenName("Patient A");

        Question question2 = new Question();
        question2.setTitle("Best Diet for Diabetes");
        question2.setContent("Dietary tips for managing diabetes");
        question2.setQuestionTime(Instant.now());
        question2.setPatientWrittenName("Patient B");

        List<Question> questionList = Arrays.asList(question1, question2);
        Page<Question> questionPage = new PageImpl<>(questionList, PageRequest.of(page, size), questionList.size());

        when(questionRepository.searchByRelevance(anyString(), any(Pageable.class))).thenReturn(questionPage);

        ResponseEntity<?> response = questionService.searchQuestion(searchTerm, page, size);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof Page);

        Page<QuestionSearchResponseDTO> resultPage = (Page<QuestionSearchResponseDTO>) response.getBody();
        assertEquals(2, resultPage.getContent().size());

        verify(questionRepository, times(1)).searchByRelevance(anyString(), any(Pageable.class));
    }

    // TC-ART-14: Empty or Invalid Search Term
    @Test
    void testSearchQuestion_EmptyOrInvalidTerm_ReturnsBadRequest() {
        String searchTerm = "";
        int page = 0;
        int size = 10;

        ResponseEntity<?> response = questionService.searchQuestion(searchTerm, page, size);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Search term cannot be empty", response.getBody());

        searchTerm = null;
        response = questionService.searchQuestion(searchTerm, page, size);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Search term cannot be empty", response.getBody());

        searchTerm = "  ";
        response = questionService.searchQuestion(searchTerm, page, size);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Search term cannot be empty", response.getBody());
    }

    // TC-ART-15: Database Exception During Search
    @Test
    void testSearchQuestion_DatabaseException_ReturnsBadRequest() {
        String searchTerm = "valid term";
        int page = 0;
        int size = 10;

        when(questionRepository.searchByRelevance(anyString(), any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> response = questionService.searchQuestion(searchTerm, page, size);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Change the search terms to make them more distinctive and retry", response.getBody());

        verify(questionRepository, times(1)).searchByRelevance(anyString(), any(Pageable.class));
    }

    // TC-QST-16: Valid Comment on Question
    @Test
    void testCommentOnQuestion_ValidComment_ReturnsCreated() {
        // Arrange
        Long doctorId = 1L;
        Long questionId = 10L;
        String content = "Drink more water";
        Instant commentTime = Instant.now();
        CommentDTO commentDTO = new CommentDTO(doctorId, content, questionId, commentTime);

        // Create mock enriched doctor and question objects
        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(doctorId);
        enrichedDoctor.setName("Dr. Smith");

        Question question = new Question();
        question.setId(questionId);
        question.setTitle("How to stay hydrated?");

        // Mock the repository calls
        when(enrichedDoctorRepository.findById(doctorId)).thenReturn(Optional.of(enrichedDoctor));
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));

        // Mock the save method to return a saved comment object
        Comment mockComment = new Comment();
        mockComment.setId(1L);
        mockComment.setContent(content);
        mockComment.setTime(commentTime);
        mockComment.setEnrichedDoctorId(enrichedDoctor.getId());
        mockComment.setQuestion(question);

        // Mocking the commentRepository.save() method
        when(commentRepository.save(any(Comment.class))).thenReturn(mockComment);

        // Act
        ResponseEntity<?> response = questionService.commentOnQuestion(commentDTO);

        // Assert
        assertEquals(201, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof CommentResponseDTO);

        // Cast response body to CommentResponseDTO and assert values
        CommentResponseDTO responseBody = (CommentResponseDTO) response.getBody();
        assertEquals(mockComment.getId(), responseBody.getId());
        assertEquals(mockComment.getContent(), responseBody.getContent());
        assertEquals(mockComment.getTime(), responseBody.getTime());
        assertEquals(enrichedDoctor.getName(), responseBody.getDoctorName());

        // Verify the comment repository's save method was called once
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    // TC-ART-17: Comment with Non-Existent Doctor
    @Test
    void testCommentOnQuestion_NonExistentDoctor_ReturnsNotFound() {
        // Arrange
        Long doctorId = -1L; // Non-existent doctor
        Long questionId = 10L;
        String content = "Drink more water";
        Instant commentTime = Instant.now();
        CommentDTO commentDTO = new CommentDTO(doctorId, content, questionId, commentTime);

        // Mock the repository calls
        when(enrichedDoctorRepository.findById(doctorId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = questionService.commentOnQuestion(commentDTO);

        // Assert
        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Doctor not found", response.getBody());

        // Verify the comment repository's save method was not called
        verify(commentRepository, times(0)).save(any(Comment.class));
    }

    // TC-ART-18: Comment on Non-Existent Question
    @Test
    void testCommentOnNonExistentQuestion_ReturnsNotFound() {
        // Arrange
        Long doctorId = 1L;
        Long nonExistentQuestionId = 99999L;
        String content = "Drink more water";
        Instant commentTime = Instant.now();
        CommentDTO commentDTO = new CommentDTO(doctorId, content, nonExistentQuestionId, commentTime);

        // Mock the enriched doctor existence
        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(doctorId);
        enrichedDoctor.setName("Dr. Smith");
        when(enrichedDoctorRepository.findById(doctorId)).thenReturn(Optional.of(enrichedDoctor));

        // Mock the non-existent question
        when(questionRepository.findById(nonExistentQuestionId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = questionService.commentOnQuestion(commentDTO);

        // Assert
        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Question not found", response.getBody());
    }

    // TC-ART-19: Unexpected Exception While Commenting
    @Test
    void testUnexpectedExceptionWhileCommenting_ReturnsInternalServerError() {
        // Arrange
        Long doctorId = 1L;
        Long questionId = 10L;
        String content = "Drink more water";
        Instant commentTime = Instant.now();
        CommentDTO commentDTO = new CommentDTO(doctorId, content, questionId, commentTime);

        // Mock the enriched doctor and question
        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(doctorId);
        enrichedDoctor.setName("Dr. Smith");
        when(enrichedDoctorRepository.findById(doctorId)).thenReturn(Optional.of(enrichedDoctor));

        Question question = new Question();
        question.setId(questionId);
        question.setTitle("How to stay hydrated?");
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));

        // Simulate an exception during comment saving
        when(commentRepository.save(any(Comment.class))).thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<?> response = questionService.commentOnQuestion(commentDTO);

        // Assert
        assertEquals(500, response.getStatusCodeValue());
        assertEquals("Error while saving comment, try again", response.getBody());
    }

    // TC-ART-20: Retrieve Comments on Existing Question
    @Test
    void testRetrieveCommentsOnExistingQuestion_ReturnsComments() {
        // Arrange
        Long questionId = 10L;
        Question question = new Question();
        question.setId(questionId);
        question.setTitle("How to stay hydrated?");
        question.setContent("Drink water regularly");

        // Create mock enriched doctor
        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(1L);
        enrichedDoctor.setName("Dr. Smith");
        enrichedDoctor.setCareerLevel("Senior");
        enrichedDoctor.setSpecializationName("Cardiology");

        // Create a comment
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setContent("Drink more water");
        comment.setTime(Instant.now());
        comment.setEnrichedDoctorId(enrichedDoctor.getId());
        comment.setQuestion(question);

        // Simulate votes
        Vote vote1 = new Vote();
        vote1.setRank(1);
        Vote vote2 = new Vote();
        vote2.setRank(-1);
        comment.setVotes(Arrays.asList(vote1, vote2));

        // Add comment to the question
        question.setComments(Collections.singletonList(comment));

        // Mock repository calls
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));
        when(enrichedDoctorRepository.findById(enrichedDoctor.getId())).thenReturn(Optional.of(enrichedDoctor));

        // Act
        ResponseEntity<?> response = questionService.getCommentsOnQuestion(questionId);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof List<?>);

        @SuppressWarnings("unchecked")
        List<CommentResponseDTO> comments = (List<CommentResponseDTO>) response.getBody();

        assertEquals(1, comments.size());

        CommentResponseDTO responseComment = comments.get(0);
        assertEquals("Drink more water", responseComment.getContent());
        assertEquals("Dr. Smith", responseComment.getDoctorName());
        assertEquals("Senior", responseComment.getDoctorCareerLevel());
        assertEquals("Cardiology", responseComment.getDoctorSpecialization());
        assertEquals(0, responseComment.getVoteCount()); // 1 - 1 = 0
    }


    //  TC-ART-21: Retrieve Comments on Non-Existent Question
    @Test
    void testRetrieveCommentsOnNonExistentQuestion_Returns404() {
        // Arrange
        Long questionId = 99999L;
        when(questionRepository.findById(questionId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = questionService.getCommentsOnQuestion(questionId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND.value(), response.getStatusCodeValue());
        assertEquals("Question not found", response.getBody());
    }

    // TC-ART-22: Unexpected Exception During Comment Retrieval
    @Test
    void testRetrieveCommentsUnexpectedException_Returns500() {
        // Arrange
        Long questionId = 10L;

        // Mock the question entity and its method to simulate exception
        Question mockQuestion = mock(Question.class);
        when(mockQuestion.getComments()).thenThrow(new RuntimeException("Database failure"));
        when(mockQuestion.getId()).thenReturn(questionId);
        when(mockQuestion.getTitle()).thenReturn("Sample Title");
        when(mockQuestion.getContent()).thenReturn("Sample Content");
        when(mockQuestion.getPatientWrittenName()).thenReturn("John Doe");
        when(mockQuestion.getQuestionTime()).thenReturn(Instant.now());

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(mockQuestion));

        // Act
        ResponseEntity<?> response = questionService.getCommentsOnQuestion(questionId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
        assertEquals("Error while retrieving comments, please retry", response.getBody());
    }

    // TC-ART-23: Valid Vote Submission
    @Test
    void testAddValidVote_ReturnsCreatedWithVoteDTO() {
        // Arrange
        VoteDTO voteDTO = new VoteDTO(1L, 1L, 1);
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setVotes(new ArrayList<>());

        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(1L);

        Vote vote = new Vote();
        vote.setVoteId(new VoteId(1L, 1L));
        vote.setRank(1);
        vote.setVoteId(new VoteId(enrichedDoctor.getId(), comment.getId()));
        vote.setComment(comment);

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(enrichedDoctorRepository.findById(1L)).thenReturn(Optional.of(enrichedDoctor));
        when(voteRepository.findById(any())).thenReturn(Optional.empty());
        when(voteRepository.save(any())).thenReturn(vote);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment)); // For vote count

        // Act
        ResponseEntity<?> response = questionService.addVoteToQuestion(voteDTO);

        // Assert
        assertEquals(HttpStatus.CREATED.value(), response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof VoteDTO);
    }

    // TC-ART-24: Voting on Non-Existent Comment
    @Test
    void testAddVoteToNonExistentComment_Returns404() {
        // Arrange
        VoteDTO voteDTO = new VoteDTO(999L, 1L, 1);
        when(commentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = questionService.addVoteToQuestion(voteDTO);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND.value(), response.getStatusCodeValue());
        assertEquals("Comment not found", response.getBody());
    }

    // TC-ART-25: Voting by Non-Existent Doctor
    @Test
    void testAddVoteByNonExistentDoctor_Returns404() {
        // Arrange
        VoteDTO voteDTO = new VoteDTO(1L, 999L, 1);
        Comment comment = new Comment();
        comment.setId(1L);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(enrichedDoctorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = questionService.addVoteToQuestion(voteDTO);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND.value(), response.getStatusCodeValue());
        assertEquals("Doctor not found", response.getBody());
    }

    // TC-ART-26: Cancel Vote with Opposite Rank
    @Test
    void testCancelVoteWithSameRank_ReturnsCreatedWithZeroRank() {
        // Arrange
        VoteDTO voteDTO = new VoteDTO(1L, 1L, 1);
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setVotes(new ArrayList<>());

        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(1L);

        Vote existingVote = new Vote();
        existingVote.setRank(1);
        existingVote.setVoteId(new VoteId(enrichedDoctor.getId(), comment.getId()));
        existingVote.setComment(comment);

        // Add existing vote to comment's votes list
        comment.getVotes().add(existingVote);

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(enrichedDoctorRepository.findById(1L)).thenReturn(Optional.of(enrichedDoctor));
        when(voteRepository.findById(any())).thenReturn(Optional.of(existingVote));
        when(voteRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ResponseEntity<?> response = questionService.addVoteToQuestion(voteDTO);

        // Assert
        assertEquals(HttpStatus.CREATED.value(), response.getStatusCodeValue());
        VoteDTO responseVoteDTO = (VoteDTO) response.getBody();
        assertEquals(0, responseVoteDTO.getRank());
    }


    // TC-ART-27: Unexpected Error During Voting
    @Test
    void testUnexpectedErrorDuringVoting_Returns500() {
        // Arrange
        VoteDTO voteDTO = new VoteDTO(1L, 1L, 1);
        Comment comment = new Comment();
        comment.setId(1L);
        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(1L);

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(enrichedDoctorRepository.findById(1L)).thenReturn(Optional.of(enrichedDoctor));
        when(voteRepository.findById(any())).thenThrow(new RuntimeException("Unexpected error"));

        // Act
        ResponseEntity<?> response = questionService.addVoteToQuestion(voteDTO);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
        assertEquals("Error while adding your vote, please retry", response.getBody());
    }
    @Test
    void testVoteWithOppositeRank_ReturnsCreatedWithCorrectRank() {
        // Arrange
        VoteDTO voteDTO = new VoteDTO(1L, 1L, -1);  // New vote with rank -1
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setVotes(new ArrayList<>());

        EnrichedDoctor enrichedDoctor = new EnrichedDoctor();
        enrichedDoctor.setId(1L);

        Vote existingVote = new Vote();
        existingVote.setRank(1);  // Existing vote rank is 1 (opposite)
        existingVote.setVoteId(new VoteId(enrichedDoctor.getId(), comment.getId()));
        existingVote.setComment(comment);

        // Add existing vote to comment's votes list
        comment.getVotes().add(existingVote);

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(enrichedDoctorRepository.findById(1L)).thenReturn(Optional.of(enrichedDoctor));
        when(voteRepository.findById(any())).thenReturn(Optional.of(existingVote));
        when(voteRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ResponseEntity<?> response = questionService.addVoteToQuestion(voteDTO);

        // Assert
        assertEquals(HttpStatus.CREATED.value(), response.getStatusCodeValue());
        VoteDTO responseVoteDTO = (VoteDTO) response.getBody();

        // Since ranks differ, the vote should update to new rank (-1)
        assertEquals(-1, responseVoteDTO.getRank());
    }

}
