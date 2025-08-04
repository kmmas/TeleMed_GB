import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    MedicalServices,
    Badge,
    Cake,
    Wc,
    Public,
    Flag,
    Phone,
    Category,
} from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import { useNavigate } from "react-router-dom";
import { ARTICLE_PUBLISH_URL } from "../../API/APIRoutes";
import usePost from "../../Hooks/usePost";
import useGet from "../../Hooks/useGet";

const AddArticle = () => {
    const navigate = useNavigate();
    const { loading, postItem } = usePost();
    const { getItem } = useGet();
    const { userId, role } = useSelector((state) => state.user);

    // State for doctor info and categories
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingDoctor, setLoadingDoctor] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (role !== "DOCTOR") {
            setError("Only doctors can submit articles");
            setLoadingDoctor(false);
            setLoadingCategories(false);
            return;
        }

        const fetchDoctorData = async () => {
            try {
                await getItem(
                    `/api/doctor/${userId}`,
                    false,
                    (response) => {
                        setDoctorInfo(response);
                        setLoadingDoctor(false);
                    },
                    (error) => {
                        setError("Failed to load doctor information");
                        setLoadingDoctor(false);
                    }
                );
            } catch (err) {
                setError("Error fetching doctor data");
                setLoadingDoctor(false);
            }
        };

        const fetchCategories = async () => {
            try {
                await getItem(
                    `/api/doctor/specialization`,
                    false,
                    (response) => {
                        setCategories(response);
                        setLoadingCategories(false);
                        // Set the first category as default if available
                        if (response.length > 0) {
                            setCategory(response[0]);
                        }
                    },
                    (error) => {
                        setError("Failed to load categories");
                        setLoadingCategories(false);
                    }
                );
            } catch (err) {
                setError("Error fetching categories");
                setLoadingCategories(false);
            }
        };

        fetchDoctorData();
        fetchCategories();
    }, [userId, role]);

    const getInitials = (name) =>
        name
            ?.split(" ")
            .filter((part) => part.length > 0)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !category) return;

        const newArticle = {
            title,
            content,
            category,
            doctorId: userId, // Use the current user's ID
            articleTime: new Date().toISOString(),
        };

        postItem(
            ARTICLE_PUBLISH_URL,
            newArticle,
            () => {
                setTitle("");
                setContent("");
                setCategory("");
                navigate("/ShowArticles");
            },
            "Article submitted successfully!",
            "Failed to submit article. Please try again."
        );
    };

    const handleCancel = () => {
        navigate("/ShowArticles");
    };

    if (loadingDoctor || loadingCategories) {
        return (
            <>
                <Navbar />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                    }}
                >
                    <CircularProgress />
                </Box>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                        p: 3,
                    }}
                >
                    <Alert severity="error">{error}</Alert>
                </Box>
                <Footer />
            </>
        );
    }

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
                {/* Doctor Info Card */}
                {doctorInfo && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Avatar
                                        sx={{
                                            bgcolor: blue[500],
                                            width: 56,
                                            height: 56,
                                        }}
                                    >
                                        {getInitials(doctorInfo.name)}
                                    </Avatar>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h6">
                                        {doctorInfo.name}
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ mt: 1, flexWrap: "wrap" }}
                                    >
                                        {doctorInfo.specialization && (
                                            <Chip
                                                icon={<MedicalServices />}
                                                label={doctorInfo.specialization}
                                                size="small"
                                            />
                                        )}
                                        {doctorInfo.careerLevel && (
                                            <Chip
                                                icon={<Badge />}
                                                label={doctorInfo.careerLevel}
                                                size="small"
                                            />
                                        )}
                                        {doctorInfo.age && (
                                            <Chip
                                                icon={<Cake />}
                                                label={`${doctorInfo.age} years`}
                                                size="small"
                                            />
                                        )}
                                        {doctorInfo.gender && (
                                            <Chip
                                                icon={<Wc />}
                                                label={doctorInfo.gender}
                                                size="small"
                                            />
                                        )}
                                        {doctorInfo.nationality && (
                                            <Chip
                                                icon={<Public />}
                                                label={doctorInfo.nationality}
                                                size="small"
                                            />
                                        )}
                                        {doctorInfo.country && (
                                            <Chip
                                                icon={<Flag />}
                                                label={doctorInfo.country}
                                                size="small"
                                            />
                                        )}
                                        {doctorInfo.phone && (
                                            <Chip
                                                icon={<Phone />}
                                                label={doctorInfo.phone}
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Article Form */}
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
                    Submit New Article
                </Typography>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    sx={{ mb: 3 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={category}
                                        label="Category"
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        startAdornment={
                                            <Category
                                                sx={{
                                                    color: "action.active",
                                                    mr: 1,
                                                }}
                                            />
                                        }
                                        required
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.specializationName} value={cat.specializationName}>
                                                {cat.specializationName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="Article Content"
                            variant="outlined"
                            multiline
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            sx={{ mb: 3 }}
                            required
                            helperText="Minimum 300 characters"
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
                                disabled={loading}
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
                                    !title.trim() ||
                                    !content.trim() ||
                                    content.length < 300 ||
                                    !category ||
                                    loading
                                }
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    "Submit Article"
                                )}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default AddArticle;


const categories = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Oncology",
    "Dermatology",
    "General Medicine",
    "Surgery",
    "Psychiatry",
];