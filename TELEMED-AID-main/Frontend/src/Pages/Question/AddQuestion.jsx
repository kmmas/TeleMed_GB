import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Chip,
    Paper,
    Stack,
} from "@mui/material";
import { Cake, Wc, Public, Flag } from "@mui/icons-material";
import usePost from "../../Hooks/usePost"; // أو حسب مكان الملف
import { QUESTION_PUBLISH_URL } from "../../API/APIRoutes";
import { blue } from "@mui/material/colors";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import { useNavigate } from "react-router-dom";

const AddQuestion = () => {
    const navigate = useNavigate();
    const [patientWrittenName, setPatientWrittenName] = useState("");
    const [title, setTitle] = useState("");
    const { loading, postItem } = usePost();

    const getInitials = (name) =>
        name
            .split(" ")
            .filter((part) => part.length > 0)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || !title.trim() || !patientWrittenName.trim())
            return;

        const newQuestion = {
            patientWrittenName,
            title,
            content,
            questionTime: new Date().toISOString(),
        };

        await postItem(
            QUESTION_PUBLISH_URL, // url
            newQuestion, // item (data to send)
            () => {
                // postCallback
                setContent("");
                setTitle("");
                setPatientWrittenName("");
                navigate("/ShowQuestions");
            },
            "Question submitted successfully!", // successMessage
            "Failed to submit question.", // errorMessage
            null, // errorCallback (optional, pass null if none)
            true, // showSnackbar (optional, true by default)
            "post" // method (optional, "post" by default)
        );
    };

    const handleCancel = () => {
        navigate("/ShowQuestions"); // or '/articles'
    };
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
                {/* Patient Profile */}

                {/* Question Form */}
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: "bold",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        "&:before, &:after": {
                            content: '""',
                            flex: 1,
                            borderColor: "divider",
                            mr: 1,
                            ml: 1,
                        },
                    }}
                >
                    Ask a Question
                </Typography>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Display Name"
                            variant="outlined"
                            value={patientWrittenName}
                            onChange={(e) =>
                                setPatientWrittenName(e.target.value)
                            }
                            sx={{ mb: 3 }}
                            required
                            helperText="Enter the name you want to appear publicly (can be fake for privacy)"
                        />

                        <TextField
                            fullWidth
                            label="Question Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 3 }}
                            required
                            helperText="Enter a clear and short title for your question"
                        />

                        <TextField
                            fullWidth
                            label="Your Question"
                            variant="outlined"
                            multiline
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            sx={{ mb: 3 }}
                            required
                            helperText="Please describe your health concern in detail"
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: blue[500],
                                    "&:hover": {
                                        backgroundColor: blue[700],
                                    },
                                }}
                                disabled={
                                    !content.trim() ||
                                    content.length < 30 ||
                                    !title.trim() ||
                                    !patientWrittenName.trim()
                                }
                            >
                                Submit Question
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default AddQuestion;
