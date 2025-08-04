import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Avatar,
    LinearProgress,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    CircularProgress,
} from "@mui/material";
import {
    AccessTime,
    CalendarToday,
    Person,
    Phone,
    Public,
    Work,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import Title from "../../Components/Title/Title";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import useGet from "../../Hooks/useGet";
import useDelete from "../../Hooks/useDelete";
import usePost from "../../Hooks/usePost";
import usePut from "../../Hooks/usePut";
const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const { userId, role } = useSelector((state) => state.user); // Get role from Redux
    const { loading, getItem } = useGet();
    const { loading: cancelLoading, deleteItem } = useDelete();
    const { loading: bookingLoading, postItem } = usePost(); // Get postItem from usePost
    const [doctorAppointmentCount, setDoctorAppointmentCount] = useState(0); // New state for count
    const { loading: countLoading, getItem: getCount } = useGet(); // New getter for count
    const [registeredUsers, setRegisteredUsers] = useState({
        patients: [],
        doctors: [],
    });
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);
    const { loading: completeLoading, putItem } = usePut(); // Add this with other hooks
    useEffect(() => {
        if (userId) {
            fetchAppointments();
            fetchDoctorAppointmentCount();
        }
    }, [userId, role]); // Add role to dependency array

    // Fetch registered users when component mounts
    useEffect(() => {
        const fetchRegisteredUsers = async () => {
            if (role !== "DOCTOR" || !userId) return;

            setUsersLoading(true);
            setUsersError(null);

            try {
                // 1. Get user IDs by role from appointment service
                const userIdsResponse = await getItem(
                    `/api/appointment/doctor/${userId}/user-ids`,
                    false // disable automatic snackbar
                );

                if (!userIdsResponse) {
                    throw new Error("Failed to fetch user IDs");
                }

                // Process patient appointments
                const patientAppointments =
                    userIdsResponse.patientAppointments || [];
                const patientIds = patientAppointments
                    .map((appt) => Number(appt.userId))
                    .filter((id) => !isNaN(id));

                // Process doctor appointments
                const doctorAppointments =
                    userIdsResponse.doctorAppointments || [];
                const doctorIds = doctorAppointments
                    .map((appt) => Number(appt.userId))
                    .filter((id) => !isNaN(id));

                console.log("Patient IDs:", patientIds);
                console.log("Doctor IDs:", doctorIds);

                // Initialize empty results
                let patientsResult = [];
                let doctorsResult = [];

                // 2. Fetch patient data (independent call)
                if (patientIds.length > 0) {
                    try {
                        console.log("Fetching patients...");
                        const patientsResponse = await postItem(
                            "/api/patient/bulk",
                            patientIds,
                            (data, sent) => {
                                console.log("Received patients:", data); // data is the Map in object form
                            },
                            () => {},
                            "Failed to load patients",
                            null,
                            false
                        );
                        // Merge patient data with appointment details
                        patientsResult = patientAppointments
                            .map((appt) => {
                                const patientData = patientsResponse
                                    ? patientsResponse[appt.userId]
                                    : {};
                                return {
                                    ...patientData,
                                    date: appt.date,
                                    time: appt.time,
                                };
                            })
                            .filter((user) => user.userId); // Filter out invalid entries
                    } catch (error) {
                        console.error("Error fetching patients:", error);
                        // Continue even if patients fail
                    }
                }

                // 3. Fetch doctor data (independent call)
                if (doctorIds.length > 0) {
                    try {
                        console.log("Fetching doctors...");
                        const doctorsResponse = await postItem(
                            "/api/doctor/bulk",
                            doctorIds,
                            (data, sent) => {
                                console.log("Received patients:", data); // data is the Map in object form
                            },
                            () => {},
                            "Failed to load doctors",
                            null,
                            false
                        );
                        // Merge doctor data with appointment details
                        doctorsResult = doctorAppointments
                            .map((appt) => {
                                const doctorData = doctorsResponse
                                    ? doctorsResponse[appt.userId]
                                    : {};
                                return {
                                    ...doctorData,
                                    date: appt.date,
                                    time: appt.time,
                                };
                            })
                            .filter((user) => user.userId); // Filter out invalid entries
                    } catch (error) {
                        console.error("Error fetching doctors:", error);
                        // Continue even if doctors fail
                    }
                }

                // Update state with whatever data we could fetch
                setRegisteredUsers({
                    patients: patientsResult,
                    doctors: doctorsResult,
                });

                console.log("Registered Users:", {
                    patients: patientsResult,
                    doctors: doctorsResult,
                });
            } catch (error) {
                console.error("Error in main fetch process:", error);
                setUsersError(
                    "Failed to load some user data. Please try again."
                );
            } finally {
                setUsersLoading(false);
            }
        };

        fetchRegisteredUsers();
    }, [userId, role]);
    // Function to fetch appointments from backend
    const fetchAppointments = async () => {
        const response = await getItem(
            `api/appointment/user/${userId}`,
            false, // disable automatic snackbar
            (data) => {
                // console.log("Successfully fetched appointments:", data);
                setAppointments(data);
                setError(null);
            },
            (err) => {
                setError("Failed to fetch appointments");
                console.error("Error fetching appointments:", err);
            }
        );
    };

    // Only fetch doctor count if user is a DOCTOR
    const fetchDoctorAppointmentCount = async () => {
        if (role === "DOCTOR") {
            await getCount(
                `api/appointment/user/${userId}/as-doctor/count`,
                false,
                (count) => {
                    setDoctorAppointmentCount(count);
                },
                (err) => {
                    console.error(
                        "Error fetching doctor appointment count:",
                        err
                    );
                }
            );
        }
    };
    const isAppointmentTimeReached = (dateString, timeString) => {
        const appointmentDate = new Date(dateString);
        const [hours, minutes] = timeString.split(":").map(Number);

        // Set the time portion of the date
        appointmentDate.setHours(hours, minutes, 0, 0);

        const now = new Date();
        return now >= appointmentDate;
    };
    const handleCompleteAppointment = async (appointment) => {
        const completionData = {
            userId: userId,
            doctorId: appointment.doctorDetails.userId,
            date: appointment.date,
            time: appointment.time,
            state: "PENDING",
        };
        console.log(completionData);
        await putItem(
            `/api/appointment/complete`,
            completionData,
            async () => {
                // Success callback - refresh appointments
                await fetchAppointments();
                if (role === "DOCTOR") {
                    await fetchDoctorAppointmentCount(); // Refresh doctor count if user is a doctor
                }
            },
            "Appointment marked as completed successfully", // successMessage
            "Failed to complete appointment", // errorMessage
            (err) => {
                console.error("Error completing appointment:", err);
            },
            true // showSnackbar
        );
    };
    const getInitials = (name) =>
        name
            ?.split(" ")
            .filter((part) => part.length > 0)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    // Function to handle appointment cancellation
    const handleCancelAppointment = async (appointment) => {
        const cancellationData = {
            userId: userId,
            doctorId: appointment.doctorDetails.userId, // Assuming doctor ID is nested under 'doctorDetails'
            date: appointment.date,
            time: appointment.time,
            state: "PENDING", // Set the state to CANCELLED as required
        };

        const handleAppointmentSuccess = async (responseData) => {
            try {
                // Second POST - Mark time slot as booked
                await postItem(
                    `/api/doctor/${appointment.doctorDetails.userId}/availability/book`,
                    {
                        day: new Date(appointment.date)
                            .toLocaleDateString("en-US", { weekday: "long" })
                            .toUpperCase(),
                        startTime: appointment.time,
                        booked: false,
                    },
                    () => {},
                    "Time slot unbooked successfully!",
                    "Failed to update time slot status"
                );
            } catch (error) {
                console.error("Error updating time slot:", error);
                alert(
                    "Appointment was created but failed to update time slot status"
                );
            }
        };
        await deleteItem(
            `/api/appointment/cancel`,
            cancellationData, // Pass the data payload here
            async (data) => {
                // deleteCallback
                // Success callback - refresh appointments
                await handleAppointmentSuccess();
                await fetchAppointments();
                if (role === "DOCTOR") {
                    await fetchDoctorAppointmentCount(); // Refresh doctor count if user is a doctor
                }
            },
            "Appointment cancelled successfully", // successMessage
            "Failed to cancel appointment", // errorMessage
            (err) => {
                // errorCallback
                console.error("Error cancelling appointment:", err);
            },
            true // showSnackbar (explicitly true for cancellation feedback)
        );
    };

    // Function to format the date
    const formatDate = (dateString) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to format time (remove seconds)
    const formatTime = (timeString) => {
        return timeString.substring(0, 5);
    };

    // Status chip colors
    const statusColors = {
        PENDING: "warning",
        COMPLETED: "success",
        CANCELLED: "error",
        CONFIRMED: "info",
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
                <Button
                    variant="contained"
                    onClick={fetchAppointments}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    // New component to display users in a grid
    const UserGrid = ({ users, role }) => {
        return (
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                {users.length === 0 ? (
                    <Typography color="text.secondary">
                        No {role.toLowerCase()}s found
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 2,
                        }}
                    >
                        {users.map((user) => (
                            <Paper
                                key={user.userId}
                                elevation={1}
                                sx={{ p: 2 }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                    }}
                                >
                                    <Avatar src={user.avatar} sx={{ mr: 2 }}>
                                        {getInitials(user.name).charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {user.name}
                                        </Typography>
                                        {user.date && user.time && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {formatDate(user.date)} at{" "}
                                                {formatTime(user.time)}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Phone: {user.phone || "N/A"}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Gender: {user.gender || "N/A"}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Country: {user.countryName || "N/A"}
                                </Typography>
                                {role === "DOCTOR" && user.specialization && (
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Specialization:{" "}
                                            {user.specialization}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Career Level: {user.careerLevel}
                                        </Typography>
                                    </Box>
                                )}
                                <Chip
                                    label={role}
                                    size="small"
                                    color={
                                        role === "PATIENT"
                                            ? "secondary"
                                            : "primary"
                                    }
                                    sx={{ mt: 1 }}
                                />
                            </Paper>
                        ))}
                    </Box>
                )}
            </Paper>
        );
    };

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Box sx={{ p: 3, maxWidth: 1700, margin: "0 auto" }}>
                <Title title="My Appointments" />

                {appointments?.length === 0 ? (
                    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6">
                            No appointments scheduled
                        </Typography>
                    </Paper>
                ) : (
                    <Grid
                        container
                        spacing={5}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {appointments.map((appointment, index) => (
                            <Grid key={index}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        width: { xs: "360px", md: "500px" },
                                        height: "100%",
                                        boxShadow:
                                            "0px 10px 25px rgba(0, 0, 0, 0.1)",
                                        borderLeft: `10px solid ${
                                            appointment.state === "COMPLETED"
                                                ? "#4caf50"
                                                : appointment.state ===
                                                  "PENDING"
                                                ? "#ff9800"
                                                : "#f44336"
                                        }`,
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                            sx={{ mb: 2 }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#33b4d4",
                                                    width: 60,
                                                    height: 60,
                                                    fontSize: "1.3rem",
                                                }}
                                            >
                                                {appointment.doctorDetails.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: "bold" }}
                                                >
                                                    {
                                                        appointment
                                                            .doctorDetails.name
                                                    }{" "}
                                                    (
                                                    {
                                                        appointment
                                                            .doctorDetails
                                                            .userId
                                                    }
                                                    )
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        appointment
                                                            .doctorDetails
                                                            .specialization
                                                    }
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Divider sx={{ my: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <CalendarToday
                                                        color="action"
                                                        fontSize="small"
                                                    />
                                                    <Typography variant="body2">
                                                        {formatDate(
                                                            appointment.date
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <AccessTime
                                                        color="action"
                                                        fontSize="small"
                                                    />
                                                    <Typography variant="body2">
                                                        {formatTime(
                                                            appointment.time
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Phone
                                                        color="action"
                                                        fontSize="small"
                                                    />
                                                    <Typography variant="body2">
                                                        {
                                                            appointment
                                                                .doctorDetails
                                                                .phone
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Public
                                                        color="action"
                                                        fontSize="small"
                                                    />
                                                    <Typography variant="body2">
                                                        {
                                                            appointment
                                                                .doctorDetails
                                                                .countryName
                                                        }{" "}
                                                        (
                                                        {
                                                            appointment
                                                                .doctorDetails
                                                                .countryId
                                                        }
                                                        )
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Work
                                                        color="action"
                                                        fontSize="small"
                                                    />
                                                    <Typography variant="body2">
                                                        {
                                                            appointment
                                                                .doctorDetails
                                                                .careerLevel
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Person
                                                        color="action"
                                                        fontSize="small"
                                                    />
                                                    <Typography variant="body2">
                                                        {
                                                            appointment
                                                                .doctorDetails
                                                                .gender
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>

                                        <Box
                                            sx={{
                                                mt: 2,
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: 1,
                                            }}
                                        >
                                            {/* Add this new Button */}
                                            {(appointment.state === "PENDING" ||
                                                appointment.state ===
                                                    "CONFIRMED") && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() =>
                                                        handleCompleteAppointment(
                                                            appointment
                                                        )
                                                    }
                                                    disabled={
                                                        completeLoading ||
                                                        !isAppointmentTimeReached(
                                                            appointment.date,
                                                            appointment.time
                                                        )
                                                    }
                                                    sx={{
                                                        textTransform: "none",
                                                        fontWeight: "bold",
                                                        borderRadius: "",
                                                    }}
                                                >
                                                    {completeLoading ? (
                                                        <CircularProgress
                                                            size={24}
                                                        />
                                                    ) : (
                                                        "Done"
                                                    )}
                                                </Button>
                                            )}

                                            {appointment.state === "PENDING" ||
                                            appointment.state ===
                                                "CONFIRMED" ? (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleCancelAppointment(
                                                            appointment
                                                        )
                                                    }
                                                    disabled={cancelLoading}
                                                    sx={{
                                                        textTransform: "none",
                                                        fontWeight: "bold",
                                                        borderRadius: "",
                                                    }}
                                                >
                                                    {cancelLoading ? (
                                                        <CircularProgress
                                                            size={24}
                                                        />
                                                    ) : (
                                                        "Cancel"
                                                    )}
                                                </Button>
                                            ) : null}
                                            <Chip
                                                label={appointment.state}
                                                color={
                                                    statusColors[
                                                        appointment.state
                                                    ] || "default"
                                                }
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: "bold",
                                                    textTransform: "uppercase",
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                {/* {role === "DOCTOR" &&
                    !countLoading &&
                    doctorAppointmentCount > 0 && (
                        <Paper
                            elevation={3}
                            sx={{
                                mt: 6,
                                p: 4,
                                background:
                                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                                borderRadius: "12px",
                                borderLeft: "6px solid #1976d2",
                                // maxWidth: "1100px",
                                margin: "40px auto 0",
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    mb: 2,
                                    color: "#1976d2",
                                }}
                            >
                                <Work sx={{ verticalAlign: "middle", mr: 1 }} />
                                Your Upcoming Doctor Responsibilities
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{ mb: 2, fontSize: "1.1rem" }}
                            >
                                We're pleased to inform you that you currently
                                have <strong>{doctorAppointmentCount} </strong>
                                scheduled appointment
                                {doctorAppointmentCount !== 1 ? "s" : ""} where
                                you'll be serving as the attending physician.
                                This represents{" "}
                                {doctorAppointmentCount !== 1
                                    ? "multiple "
                                    : "an important "}
                                opportunity to provide your expert medical care
                                and make a meaningful difference in your
                                patients' lives.
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{ mb: 2, fontSize: "1.1rem" }}
                            >
                                For each of these appointments, you'll be
                                automatically added to a dedicated chat room
                                approximately 15 minutes before the scheduled
                                time. This will allow you to:
                            </Typography>

                            <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                                <Typography
                                    component="li"
                                    variant="body1"
                                    sx={{ fontSize: "1.1rem", mb: 1 }}
                                >
                                    Review any preliminary information shared by
                                    the patient
                                </Typography>
                                <Typography
                                    component="li"
                                    variant="body1"
                                    sx={{ fontSize: "1.1rem", mb: 1 }}
                                >
                                    Conduct pre-appointment assessments if
                                    needed
                                </Typography>
                                <Typography
                                    component="li"
                                    variant="body1"
                                    sx={{ fontSize: "1.1rem" }}
                                >
                                    Prepare any necessary medical resources or
                                    documentation
                                </Typography>
                            </Box>

                            <Typography
                                variant="body1"
                                sx={{ mb: 3, fontSize: "1.1rem" }}
                            >
                                <strong>Punctuality is crucial</strong> - your
                                patients are counting on your timely arrival to
                                begin their consultation. We recommend being
                                prepared and available at least 5 minutes before
                                each scheduled appointment time to ensure a
                                smooth experience for all parties involved.
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    fontStyle: "italic",
                                    color: "#2e7d32",
                                    fontSize: "1.1rem",
                                }}
                            >
                                Your dedication to patient care is what makes
                                our healthcare community exceptional. Thank you
                                for your commitment to providing outstanding
                                medical service.
                            </Typography>
                        </Paper>
                    )} */}
            </Box>
            {role === "DOCTOR" && (
                <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
                    <Typography variant="h5" gutterBottom>
                        Users Registered With Me
                    </Typography>

                    {usersLoading ? (
                        <LinearProgress />
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Patients ({registeredUsers.patients.length})
                            </Typography>
                            <UserGrid
                                users={registeredUsers.patients}
                                role="PATIENT"
                            />

                            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                                Doctors ({registeredUsers.doctors.length})
                            </Typography>
                            <UserGrid
                                users={registeredUsers.doctors}
                                role="DOCTOR"
                            />
                        </>
                    )}
                </Box>
            )}
            <Footer />
        </>
    );
};

export default MyAppointments;
