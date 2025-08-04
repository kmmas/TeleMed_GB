import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const PageNotFound = () => {
    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <ErrorOutlineIcon sx={{ fontSize: 80, color: "#33b4d4" }} />
                </Box>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{ fontWeight: 700, color: "#2c3e50" }}
                >
                    Page Not Found
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ mb: 4, color: "text.secondary" }}
                >
                    The page you're looking for doesn't exist or is currently
                    unavailable.
                </Typography>
                <Button
                    component={Link}
                    to="/home"
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: "#33b4d4",
                        "&:hover": { backgroundColor: "#2a96b3" },
                        fontSize: "1.1rem",
                        px: 4,
                        py: 1.5,
                    }}
                >
                    Return to Home
                </Button>
            </Container>
        </>
    );
};

export default PageNotFound;
