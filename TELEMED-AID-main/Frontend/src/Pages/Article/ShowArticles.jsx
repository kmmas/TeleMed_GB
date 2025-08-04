import React, { useState } from "react";
import {
    Box,
    Typography,
    CardHeader,
    Avatar,
    CardContent,
    Paper,
    Divider,
    Button,
    Chip,
    TextField,
    Pagination,
    InputAdornment,
} from "@mui/material";
import {
    Article,
    Category,
    MedicalServices,
    Add,
    Search as SearchIcon,
} from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Add this import
import useFetch from "../../Hooks/useFetch";
import { ARTICLE_SEARCH_URL } from "../../API/APIRoutes";

const ShowArticles = () => {
    const [expandedArticles, setExpandedArticles] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { userId, role, isLogged } = useSelector((state) => state.user);
    const articlesPerPage = 5;
    const navigate = useNavigate();

    const {
        data: articles,
        totalPages,
        isLoading,
        error,
    } = useFetch(searchTerm, currentPage, articlesPerPage, ARTICLE_SEARCH_URL);

    const getInitials = (name) =>
        name
            .split(" ")
            .filter((part) => part.length > 0)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

    const toggleExpand = (articleId) => {
        setExpandedArticles((prev) => ({
            ...prev,
            [articleId]: !prev[articleId],
        }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handlePageChange = (_, value) => {
        setCurrentPage(value);
    };

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        Medical Articles
                    </Typography>
                    {role !== "PATIENT" && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate("/AddArticle")}
                            sx={{
                                bgcolor: "#33b4d4",
                                "&:hover": {
                                    bgcolor: "#2a9cb3",
                                },
                            }}
                        >
                            New Article
                        </Button>
                    )}
                </Box>

                <TextField
                    placeholder="Search articles..."
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ mb: 4 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {articles.length === 0 ? (
                    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                        <Article
                            sx={{ fontSize: 60, color: "#33b4d4", mb: 2 }}
                        />
                        <Typography variant="h6" color="textSecondary">
                            No articles found
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        <Paper elevation={3} sx={{ p: 0 }}>
                            {articles.map((article, index) => (
                                <React.Fragment key={article.id}>
                                    <Box sx={{ p: 3 }}>
                                        <CardHeader
                                            avatar={
                                                <Avatar
                                                    sx={{
                                                        bgcolor: blue[500],
                                                        width: 50,
                                                        height: 50,
                                                    }}
                                                >
                                                    {getInitials(
                                                        article.doctorName
                                                    )}
                                                </Avatar>
                                            }
                                            title={article.doctorName}
                                            subheader={`${article.doctorSpecialization} • ${article.date}`}
                                            action={
                                                <Chip
                                                    icon={<Category />}
                                                    label={article.category}
                                                    color="primary"
                                                    sx={{ mr: 2 }}
                                                />
                                            }
                                        />
                                        <CardContent sx={{ pt: 0 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: "bold",
                                                    mb: 1,
                                                }}
                                            >
                                                {article.title}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    whiteSpace: "pre-line",
                                                    mb: 3,
                                                    ...(!expandedArticles[
                                                        article.id
                                                    ] && {
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow: "hidden",
                                                    }),
                                                }}
                                            >
                                                {article.content}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<MedicalServices />}
                                                onClick={() =>
                                                    toggleExpand(article.id)
                                                }
                                                sx={{
                                                    color: blue[500],
                                                    borderColor: blue[500],
                                                    "&:hover": {
                                                        borderColor: blue[700],
                                                        backgroundColor:
                                                            blue[50],
                                                    },
                                                }}
                                            >
                                                {expandedArticles[article.id]
                                                    ? "Show Less"
                                                    : "Read Full Article"}
                                            </Button>
                                        </CardContent>
                                    </Box>
                                    {index < articles.length - 1 && (
                                        <Divider
                                            sx={{ mx: 3, border: "1px solid" }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </Paper>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 4,
                            }}
                        >
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

export default ShowArticles;
