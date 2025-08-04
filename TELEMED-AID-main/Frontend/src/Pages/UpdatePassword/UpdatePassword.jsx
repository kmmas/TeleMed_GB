import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
const UpdatePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const validatePasswords = () => {
        if (!formData.oldPassword) {
            setError("Please enter your current password");
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            return false;
        }

        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters");
            return false;
        }

        if (formData.oldPassword === formData.newPassword) {
            setError("New password must be different from old password");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePasswords()) return;

        try {
            await axios.put("/api/auth/updatePassword", {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });
            setSuccess(true);
            setTimeout(() => navigate("/profile"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Password update failed");
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Update Password
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Password updated successfully!
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Current Password"
                            name="oldPassword"
                            type="password"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <Box
                            sx={{
                                mt: 3,
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => navigate(-1)}
                                sx={{
                                    color: "white",
                                    bgcolor: "#c2185b",
                                    borderColor: "#33b4d4",
                                    "&:hover": {
                                        borderColor: "#2a96b3",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: "#33b4d4",
                                    "&:hover": { backgroundColor: "#2a96b3" },
                                }}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};

export default UpdatePassword;
