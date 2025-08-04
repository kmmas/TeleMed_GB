import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    Box,
    Button,
    TextField,
    Autocomplete,
    Paper,
    IconButton,
    LinearProgress,
    Alert
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";
import Title from "../../Components/Title/Title";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import usePost from "../../Hooks/usePost";

const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

const Availability = () => {
    const { userId } = useSelector((state) => state.user);
    const [availability, setAvailability] = useState({
        days: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { postItem } = usePost();

    const addNewDay = () => {
        setAvailability({
            ...availability,
            days: [
                ...availability.days,
                {
                    dayOfWeek: "",
                    timeSlots: [],
                },
            ],
        });
    };

    const handleDayChange = (index, value) => {
        const updatedDays = [...availability.days];
        updatedDays[index].dayOfWeek = value;
        setAvailability({ ...availability, days: updatedDays });
    };

    const addTimeSlot = (dayIndex) => {
        const updatedDays = [...availability.days];
        updatedDays[dayIndex].timeSlots.push({
            startTime: "08:00:00",
            duration: 1,
        });
        setAvailability({ ...availability, days: updatedDays });
    };

    const handleTimeChange = (dayIndex, slotIndex, newValue) => {
        const updatedDays = [...availability.days];
        updatedDays[dayIndex].timeSlots[slotIndex].startTime =
            dayjs(newValue).format("HH:mm:ss");
        setAvailability({ ...availability, days: updatedDays });
    };

    const handleDurationChange = (dayIndex, slotIndex, value) => {
        const updatedDays = [...availability.days];
        updatedDays[dayIndex].timeSlots[slotIndex].duration = parseInt(value);
        setAvailability({ ...availability, days: updatedDays });
    };

    const removeDay = (index) => {
        const updatedDays = availability.days.filter((_, i) => i !== index);
        setAvailability({ ...availability, days: updatedDays });
    };

    const removeTimeSlot = (dayIndex, slotIndex) => {
        const updatedDays = [...availability.days];
        updatedDays[dayIndex].timeSlots = updatedDays[
            dayIndex
        ].timeSlots.filter((_, i) => i !== slotIndex);
        setAvailability({ ...availability, days: updatedDays });
    };

const handleSubmit = async () => {
    if (availability.days.length === 0) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        // Prepare the data in the correct DTO format
        const requestData = {
            days: availability.days.map(day => ({
                dayOfWeek: day.dayOfWeek,
                timeSlots: day.timeSlots.map(slot => ({
                    startTime: slot.startTime,
                    duration: slot.duration
                }))
            }))
        };

        // Send to backend
        const response = await postItem(
            `/api/doctor/${userId}/availability`,
            requestData,
            (data, sent) => {
                console.log("Callback success:", data, sent);
            }
        );
        
        if (response !== false) {
            setSuccess(true);
            // Clear the form data
            setAvailability({ days: [] });
            // Optionally: Scroll to top to show success message
            window.scrollTo(0, 0);
        } else {
            setError(response?.message || "Failed to save availability");
        }
    } catch (err) {
        setError(err.message || "An error occurred while saving availability");
    } finally {
        setLoading(false);
    }
};

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Title title="Set Your Availability" />

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Availability saved successfully!
                            </Alert>
                        )}

                        <Button
                            variant="contained"
                            onClick={addNewDay}
                            disabled={loading}
                            sx={{
                                mb: 2,
                                width: "100%",
                                py: 1.5,
                                fontSize: "1.1rem",
                                textTransform: "none",
                                bgcolor: "#33b4d4",
                                "&:hover": { bgcolor: "#2c3e50" },
                            }}
                        >
                            Add New Day
                        </Button>

                        {loading && <LinearProgress sx={{ mb: 2 }} />}

                        {availability.days.map((day, dayIndex) => (
                            <Paper
                                key={dayIndex}
                                elevation={1}
                                sx={{
                                    px: 2,
                                    pt: 0.2,
                                    mb: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        mt: 2,
                                        display: "flex",
                                        justifyContent: "center",
                                        mb: 4,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: {
                                                xs: "400px",
                                                sm: "800px",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: {
                                                    xs: "column",
                                                    sm: "row",
                                                },
                                                gap: 2,
                                                justifyContent: "space-evenly",
                                                mb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: {
                                                        xs: "100%",
                                                        sm: "30%",
                                                    },
                                                }}
                                            >
                                                <Autocomplete
                                                    options={daysOfWeek}
                                                    value={day.dayOfWeek}
                                                    onChange={(_, newValue) =>
                                                        handleDayChange(
                                                            dayIndex,
                                                            newValue
                                                        )
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Day of Week"
                                                            disabled={loading}
                                                        />
                                                    )}
                                                    disableClearable
                                                />
                                            </Box>
                                            <Box
                                                sx={{
                                                    width: {
                                                        xs: "100%",
                                                        sm: "30%",
                                                    },
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        addTimeSlot(dayIndex)
                                                    }
                                                    disabled={loading}
                                                    sx={{
                                                        width: "100%",
                                                        py: 1.5,
                                                        fontSize: "1.1rem",
                                                        textTransform: "none",
                                                        bgcolor: "#33b4d4",
                                                        "&:hover": {
                                                            bgcolor: "#2c3e50",
                                                        },
                                                    }}
                                                >
                                                    Add Time Slot
                                                </Button>
                                            </Box>
                                            <IconButton
                                                onClick={() =>
                                                    removeDay(dayIndex)
                                                }
                                                disabled={loading}
                                            >
                                                <Delete color="error" />
                                            </IconButton>
                                        </Box>
                                        {day.timeSlots.map(
                                            (slot, slotIndex) => (
                                                <React.Fragment key={slotIndex}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: {
                                                                xs: "column",
                                                                sm: "row",
                                                            },
                                                            gap: 2,
                                                            justifyContent:
                                                                "space-evenly",
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: {
                                                                    xs: "100%",
                                                                    sm: "30%",
                                                                },
                                                            }}
                                                        >
                                                            <TimePicker
                                                                label="Start Time"
                                                                value={dayjs(
                                                                    slot.startTime,
                                                                    "HH:mm:ss"
                                                                )}
                                                                onChange={(
                                                                    newValue
                                                                ) =>
                                                                    handleTimeChange(
                                                                        dayIndex,
                                                                        slotIndex,
                                                                        newValue
                                                                    )
                                                                }
                                                                disabled={loading}
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextField
                                                                        {...params}
                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                width: {
                                                                    xs: "100%",
                                                                    sm: "30%",
                                                                },
                                                            }}
                                                        >
                                                            <TextField
                                                                label="Duration (hours)"
                                                                type="number"
                                                                value={
                                                                    slot.duration
                                                                }
                                                                onChange={(e) =>
                                                                    handleDurationChange(
                                                                        dayIndex,
                                                                        slotIndex,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                disabled={loading}
                                                                sx={{
                                                                    width: "100%",
                                                                }}
                                                            />
                                                        </Box>
                                                        <IconButton
                                                            onClick={() =>
                                                                removeTimeSlot(
                                                                    dayIndex,
                                                                    slotIndex
                                                                )
                                                            }
                                                            disabled={loading}
                                                        >
                                                            <Delete color="error" />
                                                        </IconButton>
                                                    </Box>
                                                </React.Fragment>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
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
                                    width: {
                                        xs: "0%",
                                        sm: "50%",
                                    },
                                }}
                            ></Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={availability.days.length === 0 || loading}
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "33%",
                                    },
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    textTransform: "none",
                                    bgcolor: "#c2185b",
                                    "&:hover": { bgcolor: "#880e4f" },
                                }}
                            >
                                {loading ? "Saving..." : "Save Availability"}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </LocalizationProvider>
            <Footer />
        </>
    );
};

export default Availability;