import SearchableDropDown from "../../Components/DropDown/SearchableDropDown"; // Adjust path as needed
import React, { useState, useEffect } from "react";
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
import useGet from "../../Hooks/useGet";
import usePut from "../../Hooks/usePut"; // Import usePut
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useSelector } from 'react-redux';

const UpdateInfo = () => {
    const { userId, role } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { loading: getLoading, getItem } = useGet();
    const { loading: putLoading, putItem } = usePut(); // Destructure putItem and its loading state

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        ...(role === "DOCTOR" && {
            specialization: "",
            careerLevel: "",
        }),
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let response;
                if (role === "DOCTOR") {
                    response = await getItem(
                        `/api/doctor/${userId}`,
                        false, // disable snackbar
                        (data) => {
                            setFormData({
                                name: data.name || "",
                                phone: data.phone || "",
                                specialization: data.specialization || "",
                                careerLevel: data.careerLevel || "",
                            });
                        },
                        (err) => {
                            setError(
                                err.response?.data?.message ||
                                    "Failed to load doctor data"
                            );
                        }
                    );
                } else {
                    response = await getItem(
                        `/api/patient/get-patient/${userId}`, // Assuming '1' is a placeholder for the patient ID
                        false, // disable snackbar
                        (data) => {
                            setFormData({
                                name: data.name || "",
                                phone: data.phone || "",
                            });
                        },
                        (err) => {
                            setError(
                                err.response?.data?.message ||
                                    "Failed to load patient data"
                            );
                        }
                    );
                }
            } catch (err) {
                setError("Failed to load user data");
            }
        };

        fetchUserData();
    }, [role, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDropdownChange = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        try {
            let updateData;
            let updateEndpoint;

            if (role === "DOCTOR") {
                updateData = {
                    name: formData.name,
                    phone: formData.phone,
                    specialization: formData.specialization,
                    careerLevel: formData.careerLevel,
                };
                updateEndpoint = `/api/doctor/${userId}`;
            } else {
                updateData = {
                    name: formData.name,
                    phone: formData.phone,
                };
                updateEndpoint = `/api/patient/update-patient/${userId}`; // Assuming '1' is a placeholder for the patient ID
            }

            // Use putItem instead of postItem
            const result = await putItem(
                updateEndpoint,
                updateData,
                () => {
                    setSuccess(true);
                },
                "Information updated successfully!",
                "Update failed", // Error message for the snackbar
                (err) => {
                    // Error callback
                    setError(err.response?.data?.message || "Update failed");
                },
                false // show snackbar
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "An unexpected error occurred during update."
            );
        }
    };

    if (getLoading) return <Typography>Loading...</Typography>;

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Update {role === "DOCTOR" ? "Doctor" : "Patient"}{" "}
                        Information
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Information updated successfully!
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "space-between",
                                mb: 2,
                            }}
                        >
                            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Box>
                            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Box>
                        </Box>

                        {role === "DOCTOR" && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row",
                                        },
                                        justifyContent: "space-between",
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: "100%", sm: "48%" },
                                        }}
                                    >
                                        <SearchableDropDown
                                            placeholder={formData.specialization ? formData.specialization : "Select your specialization"}
                                            name="specialization"
                                            value={formData.specialization}
                                            setState={(value) => handleDropdownChange("specialization", value)}
                                            items={[
                                                { name: "Cardiology" },
                                                { name: "Neurology" },
                                                { name: "Pediatrics" },
                                            ]}
                                            required
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            width: { xs: "100%", sm: "48%" },
                                        }}
                                    >
                                        <SearchableDropDown
                                            placeholder= {formData.careerLevel ? formData.careerLevel : "Select your career level"}
                                            name="careerLevel"
                                            value={formData.careerLevel}
                                            setState={(value) =>
                                                handleDropdownChange(
                                                    "careerLevel",
                                                    value
                                                )
                                            }
                                            items={[
                                                { name: "Junior" },
                                                { name: "Mid-level" },
                                                { name: "Senior" },
                                            ]}
                                            required
                                        />
                                    </Box>
                                </Box>
                            </>
                        )}

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
                                onClick={() => navigate("/update-password")}
                                sx={{
                                    color: "white",
                                    bgcolor: "#c2185b",
                                    "&:hover": { bgcolor: "#ad1457" },
                                }}
                            >
                                Update Password
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={putLoading}
                                sx={{
                                    backgroundColor: "#33b4d4",
                                    "&:hover": { backgroundColor: "#2a96b3" },
                                }}
                            >
                                {putLoading
                                    ? "Updating..."
                                    : "Update Information"}{" "}
                                {/* Use putLoading here */}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};

export default UpdateInfo;
