import useGet from '../../Hooks/useGet';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  CardHeader,
  Avatar,
  CardContent,
  Paper,
  Divider,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Pagination,
  CircularProgress
} from '@mui/material';
import { QuestionAnswer, Add, Comment, Send } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import { useNavigate } from 'react-router-dom';
import useFetch from '../../Hooks/useFetch';
import usePost from '../../Hooks/usePost';
import { QUESTION_SEARCH_URL, QUESTION_ADD_COMMENT_URL, QUESTION_GET_COMMENT_URL, QUESTION_COMMENT_ADD_VOTE_URL} from "../../API/APIRoutes";

const ShowQuestions = () => {
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loadingCommentsFor, setLoadingCommentsFor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const navigate = useNavigate();
  const { loading: commentLoading, postItem } = usePost();
  const { getItem } = useGet();
  const [commentTexts, setCommentTexts] = useState({});
  const { userId, role } = useSelector((state) => state.user);
  const currentDoctorId = userId;
  const isDoctor = role === "DOCTOR";

  const { data: questions, totalPages, isLoading } = useFetch(
      searchTerm,
      currentPage,
      questionsPerPage,
      QUESTION_SEARCH_URL
  );

  const getInitials = (name) =>
      name
          .split(' ')
          .filter(part => part.length > 0)
          .map(part => part[0])
          .join('')
          .toUpperCase();

  const toggleExpand = (questionId) => {
    setExpandedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleComments = (questionId) => {
    setShowComments(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));

    if (comments[questionId]) return;

    setLoadingCommentsFor(questionId);

    getItem(
        `${QUESTION_GET_COMMENT_URL}?questionId=${questionId}`,
        true,
        (data) => {
          setComments(prev => ({
            ...prev,
            [questionId]: data
          }));
        },
        (err) => {
          console.error("Failed to fetch comments", err);
        }
    ).finally(() => {
      setLoadingCommentsFor(null);
    });
  };

  const handleVote = (commentId, rank) => {
    const voteDTO = {
      commentId,
      doctorId: currentDoctorId,
      rank,
    };

    postItem(
        QUESTION_COMMENT_ADD_VOTE_URL,
        voteDTO,
        (responseVoteDTO) => {
          // تحديث عدد التصويتات داخل التعليق مباشرة
          setComments(prevComments => {
            const newComments = { ...prevComments };
            for (const qId in newComments) {
              newComments[qId] = newComments[qId].map(comment =>
                  comment.id === commentId
                      ? { ...comment, voteCount: responseVoteDTO.rank }
                      : comment
              );
            }
            return newComments;
          });
        },
        "Vote registered successfully",
        "Error while voting"
    );
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleCommentChange = (questionId, text) => {
    setCommentTexts(prev => ({ ...prev, [questionId]: text }));
  };


  const addComment = (questionId) => {
    const content = commentTexts[questionId]?.trim();
    if (!content) return;

    const commentDTO = {
      doctorId: currentDoctorId,
      content,
      questionId,
      commentTime: new Date().toISOString(),
    };

    postItem(
        QUESTION_ADD_COMMENT_URL,
        commentDTO,
        () => {
          getItem(
              `${QUESTION_GET_COMMENT_URL}?questionId=${questionId}`,
              false,
              (data) => {
                setComments(prev => ({
                  ...prev,
                  [questionId]: data
                }));
                setShowComments(prev => ({
                  ...prev,
                  [questionId]: true
                }));
                setCommentTexts(prev => ({ ...prev, [questionId]: "" }));
              },
              (err) => {
                console.error("Error while refreshing comments after posting", err);
              }
          );
        },
        "Comment added successfully"
    );
  };


  return (
      <>
        <ScrollToTop />
        <Navbar />
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>General Questions</Typography>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/AddQuestion')}
                sx={{ bgcolor: "#33b4d4", "&:hover": { bgcolor: "#2a9cb3" } }}
            >
              Ask Question
            </Button>
          </Box>

          <TextField
              fullWidth
              variant="outlined"
              label="Search questions..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 4 }}
          />

          {isLoading ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>Loading questions...</Typography>
              </Box>
          ) : questions.length === 0 ? (
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <QuestionAnswer sx={{ fontSize: 60, color: "#33b4d4", mb: 2 }} />
                <Typography variant="h6" color="textSecondary">No questions available yet</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/AddQuestion')}
                    sx={{ mt: 2, backgroundColor: "#33b4d4", '&:hover': { backgroundColor: "#2a9cb3" } }}
                >
                  Ask First Question
                </Button>
              </Paper>
          ) : (
              <>
                <Paper elevation={3}>
                  {questions.map((question, index) => (
                      <React.Fragment key={question.id}>
                        <Box sx={{ p: 3 }}>
                          <CardHeader
                              avatar={<Avatar sx={{ bgcolor: blue[500], width: 50, height: 50 }}>{getInitials(question.patientWrittenName)}</Avatar>}
                              title={question.patientWrittenName}
                          />
                          <CardContent sx={{ pt: 0 }}>
                            <Typography variant="caption" color="text.secondary">
                              Posted on: {new Date(question.questionTime).toLocaleString()}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                  whiteSpace: 'pre-line',
                                  mb: 3,
                                  ...(!expandedQuestions[question.id] && {
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  })
                                }}
                            >
                              {question.content}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => toggleComments(question.id)}
                                    startIcon={<Comment />}
                                    sx={{
                                      color: blue[500],
                                      borderColor: blue[500],
                                      '&:hover': { borderColor: blue[700], backgroundColor: blue[50] }
                                    }}
                                >
                                  {showComments[question.id] ? 'Hide Comments' : 'Show Comments'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => toggleExpand(question.id)}
                                    sx={{
                                      color: blue[500],
                                      borderColor: blue[500],
                                      '&:hover': { borderColor: blue[700], backgroundColor: blue[50] }
                                    }}
                                >
                                  {expandedQuestions[question.id] ? 'Show Less' : 'Read Full Question'}
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>

                          {}
                          {showComments[question.id] && (
                              <Box sx={{ mt: 2, ml: 8 }}>
                                {loadingCommentsFor === question.id ? (
                                    <Typography variant="body2" color="text.secondary">
                                      Loading comments...
                                    </Typography>
                                ) : comments[question.id]?.length > 0 ? (
                                    <List dense>
                                      {comments[question.id].map((comment) => (
                                          <ListItem key={comment.id} alignItems="flex-start">
                                            <ListItemAvatar>
                                              <Avatar>{getInitials(comment.doctorName)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                  <>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                      {comment.doctorName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                      {comment.doctorSpecialization} • {comment.doctorCareerLevel}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                      {new Date(comment.time).toLocaleString()}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                                      {comment.content}
                                                    </Typography>
                                                    {/* voting if doctor */}
                                                    {isDoctor && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                          <Button
                                                              size="small"
                                                              variant="outlined"
                                                              onClick={() => handleVote(comment.id, 1)}
                                                          >
                                                            👍 Upvote
                                                          </Button>
                                                          <Button
                                                              size="small"
                                                              variant="outlined"
                                                              onClick={() => handleVote(comment.id, -1)}
                                                          >
                                                            👎 Downvote
                                                          </Button>
                                                        </Box>
                                                    )}
                                                  </>
                                                }
                                                secondary={
                                                  <Typography variant="caption" color="text.secondary">
                                                    Votes: {comment.voteCount}
                                                  </Typography>
                                                }
                                            />
                                          </ListItem>
                                      ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      No comments yet.
                                    </Typography>
                                )}

                                {isDoctor && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                      <TextField
                                          fullWidth
                                          variant="outlined"
                                          size="small"
                                          label="Write a comment..."
                                          value={commentTexts[question.id] || ""}
                                          onChange={(e) => handleCommentChange(question.id, e.target.value)}
                                      />
                                      <IconButton
                                          onClick={() => addComment(question.id)}
                                          disabled={commentLoading}
                                          sx={{ ml: 1, bgcolor: blue[500], '&:hover': { bgcolor: blue[700] } }}
                                      >
                                        <Send sx={{ color: 'white' }} />
                                      </IconButton>
                                    </Box>
                                )}
                              </Box>
                          )}
                        </Box>

                        {index < questions.length - 1 && (<Divider sx={{ mx: 3, border: '1px solid' }} />)}
                      </React.Fragment>
                  ))}
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                  />
                </Box>
              </>
          )}
        </Box>
        <Footer />
      </>
  );

};

export default ShowQuestions;