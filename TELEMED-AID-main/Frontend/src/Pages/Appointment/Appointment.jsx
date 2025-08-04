import React from "react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import DropdownBox from "../../Components/DropDown/DropdownBox";
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import useGet from "../../Hooks/useGet";
import { useSelector } from "react-redux";
import usePost from "../../Hooks/usePost";
const transformDoctorData = (doctors) => {    
    return doctors.flatMap((doctor) => {
        // Get all available time slots across all days
        const allSlots = doctor.availability.flatMap((day) =>
            day.timeSlots.map((slot) => ({
                day: day.day,
                startTime: slot.startTime.substring(0, 5),
                endTime: calculateEndTime(
                    slot.startTime.substring(0, 5),
                    slot.duration
                ),
                duration: slot.duration,
                booked: slot.booked // Add booked status

            }))
        );

        // If no slots, return a single row with "Not available"
        if (allSlots.length === 0) {
            return [
                {
                    id: doctor.userId,
                    doctorId: doctor.userId,
                    fullName: doctor.name,
                    specialization: doctor.specialization,
                    careerLevel: doctor.careerLevel,
                    day: "Not available",
                    timeslot: "No time slots",
                    phone: doctor.phone,
                    rawAvailability: doctor.availability,
                    booked: true // Mark as booked to disable button

                },
            ];
        }

        // Create a complete row for each time slot
        return allSlots.map((slot, index) => ({
            id: `${doctor.userId}-${index}`, // Unique ID for each slot
            doctorId: doctor.userId,
            fullName: doctor.name, // Repeat full name for each slot
            specialization: doctor.specialization, // Repeat specialization
            careerLevel: doctor.careerLevel, // Repeat career level
            day: slot.day,
            timeslot: `${slot.startTime}-${slot.endTime}`,
            phone: doctor.phone,
            rawAvailability: doctor.availability,
            booked: slot.booked // Include booked status

        }));
    });
};
// Helper function to calculate end time
const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + Math.floor(duration);
    const endMinutes = minutes + (duration % 1) * 60;

    // Handle minute overflow
    const adjustedHours = endHours + Math.floor(endMinutes / 60);
    const adjustedMinutes = endMinutes % 60;

    return `${adjustedHours.toString().padStart(2, "0")}:${adjustedMinutes
        .toString()
        .padStart(2, "0")}`;
};

const Appointment = () => {
    const columns = [
        {
            field: "doctorId",
            headerName: "ID",
            width: 80,
            headerAlign: "center",
            headerClassName: "header",
            align: "center",
        },
        {
            field: "fullName",
            headerName: "Doctor",
            width: 180,
            headerAlign: "center",
            headerClassName: "header",
            align: "center",
        },
        {
            field: "specialization",
            headerName: "Specialization",
            width: 170,
            headerAlign: "center",
            headerClassName: "header",
            align: "center",
        },
        {
            field: "careerLevel",
            headerName: "Career Level",
            width: 170,
            headerAlign: "center",
            headerClassName: "header",
            align: "center",
        },
        {
            field: "day",
            headerName: "Availability Day",
            width: 170,
            headerAlign: "center",
            headerClassName: "header",
            align: "center",
            renderCell: (params) => (
                <Typography
                    color={
                        params.value === "Not available" ? "error" : "inherit"
                    }
                >
                    {params.value}
                </Typography>
            ),
        },
        {
            field: "timeslot",
            headerName: "Time Slot",
            width: 170,
            headerAlign: "center",
            headerClassName: "header",
            align: "center",
            renderCell: (params) =>
                params.value === "No time slots" ? (
                    <Typography color="error" variant="body2">
                        No availability
                    </Typography>
                ) : (
                    <Chip
                        label={params.value}
                        color="primary"
                        variant="outlined"
                        sx={{
                            backgroundColor: "#e3f2fd",
                            borderColor: "#33b4d4",
                        }}
                    />
                ),
        },
        {
            field: "appointment",
            headerAlign: "center",
            headerName: "Book",
            width: 170,
            renderCell: (params) => {
                const isUnavailable = params.row.day === "Not available";
                const isBooked = params.row.booked;
                const isDisabled = isUnavailable || isBooked;

                return (
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleBookAppointment(params.row)}
                        disabled={isDisabled}
                        sx={{
                            backgroundColor: isBooked
                                ? "#f44336" // Solid red for booked
                                : isUnavailable
                                    ? "#e0e0e0" // Grey for unavailable
                                    : "#4caf50", // Green for available
                            "&:hover": {
                                backgroundColor: isBooked
                                    ? "#d32f2f" // Darker red on hover
                                    : isUnavailable
                                        ? "#e0e0e0" // Keep grey on hover
                                        : "#388e3c", // Darker green on hover
                            },
                            "&.Mui-disabled": {
                                backgroundColor: isBooked
                                    ? "#f44336" // Keep red when disabled
                                    : "#e0e0e0", // Grey for unavailable
                                color: isBooked
                                    ? "#fff" // White text for red button
                                    : "rgba(0, 0, 0, 0.26)", // Default disabled text
                            },
                            color: "#fff",
                        }}
                    >
                        {isUnavailable
                            ? "Unavailable"
                            : isBooked
                                ? "Booked"
                                : "Book Now"}
                    </Button>
                );
            },
        },
    ];
    const [searchCriteria, setSearchCriteria] = useState({});
    const { loading: bookingLoading, postItem } = usePost(); // Get postItem from usePost
    const { loading, getItem } = useGet();
    const [rows, setRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 7, // Match backend default
    });
    const [rowCount, setRowCount] = useState(0); // Initialize with 1 instead of 0
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [careerLevels, setCareerLevels] = useState([]);

    const { userId , role } = useSelector((state) => state.user); // Get user ID from Redux

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const searchDoctors = async (searchParams = {}) => {
        const params = {
            page: paginationModel.page,
            size: paginationModel.pageSize,
            ...searchParams,
        };

        try {
            const response = await getItem(
                `/api/doctor/search?${new URLSearchParams(params).toString()}`,
                false
            );

            if (response) {
                const transformedRows = transformDoctorData(response.content);
                setRows(transformedRows);
                setRowCount(response.totalItems);
            }
            return response;
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setRows([]);
            setRowCount(0);
            throw error;
        }
    };
    const handleBookAppointment = async (slotData) => {
        if (!userId) {
            alert("Please log in to book an appointment");
            return;
        }

        if (slotData.booked) {
            alert("This time slot is already booked");
            return;
        }

        // Calculate appointment date
        const dayOfWeekMap = {
            SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
            THURSDAY: 4, FRIDAY: 5, SATURDAY: 6
        };

        const today = dayjs();
        const todayDay = today.day();
        const targetDay = dayOfWeekMap[slotData.day];

        let daysToAdd = targetDay - todayDay;
        if (daysToAdd <= 0) daysToAdd += 7;

        const appointmentDate = today.add(daysToAdd, "day");
        const appointmentDateToSend = appointmentDate.format("YYYY-MM-DD");
        const startTime = slotData.timeslot.split("-")[0] + ":00";

        try {
            // Define success handler for appointment booking
            const handleAppointmentSuccess = async (responseData) => {
                try {
                    // Second POST - Mark time slot as booked
                    await postItem(
                        `/api/doctor/${slotData.doctorId}/availability/book`,
                        {
                            day: slotData.day,
                            startTime: startTime,
                            booked: true
                        },
                        () => {
                            // Refresh data after successful booking
                            searchDoctors({
                                ...searchCriteria,
                                page: paginationModel.page,
                                size: paginationModel.pageSize,
                            });
                        },
                        "Time slot booked successfully!",
                        "Failed to update time slot status"
                    );
                } catch (error) {
                    console.error("Error updating time slot:", error);
                    alert("Appointment was created but failed to update time slot status");
                }
            };

            // First POST - Create appointment with success handler
            await postItem(
                "/api/appointment/book",
                {
                    userId: userId,
                    doctorId: slotData.doctorId,
                    date: appointmentDateToSend,
                    time: startTime,
                    state: "PENDING",
                    userRole: role // Or "DOCTOR" depending on your use case

                },
                handleAppointmentSuccess, // Using the defined success handler
                "Creating appointment...",
                "Failed to create appointment"
            );

        } catch (error) {
            console.error("Booking error:", error);
            alert("An error occurred during booking. Please try again.");
        }
    };
    const fetchDropdownOptions = async () => {
        try {
            const specs = await getItem("/api/doctor/specialization");
            if (specs) setSpecializations(specs);

            const careers = await getItem("/api/doctor/career-level");
            if (careers) setCareerLevels(careers);
        } catch (error) {
            console.error("Error fetching dropdown options:", error);
        }
    };
    useEffect(() => {
        fetchDropdownOptions();
    }, []);

    const handlePaginationModelChange = (newModel) => {
        // Ensure page doesn't exceed total pages
        const lastPage = Math.ceil(rowCount / newModel.pageSize) - 1;
        const validatedPage = Math.min(newModel.page, lastPage);

        setPaginationModel({
            page: validatedPage,
            pageSize: newModel.pageSize,
        });
        // Don't call searchDoctors here - the useEffect will handle it
    };
    const onSearchSubmit = (data) => {
        const searchParams = {
            name: data.fullName,
            specialization: data.specialization,
            careerLevel: data.careerLevel,
            appointmentDate: data.appointmentDate
                ? dayjs(data.appointmentDate).format("dddd").toUpperCase()
                : null,
            startTime: data.appointmentTime
                ? dayjs(data.appointmentTime).format("HH:mm")
                : null,
            page: 0, // Reset to first page on new search
            size: paginationModel.pageSize,
        };

        const cleanParams = Object.fromEntries(
            Object.entries(searchParams).filter(([_, v]) => v != null)
        );
        // console.log("Search Criteria Sent to Backend:", cleanParams);
        setSearchCriteria(cleanParams);
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        searchDoctors(cleanParams);
    };
    // useEffect(() => {
    //     searchDoctors();
    //     // fetchDropdownOptions();
    // }, []);
    useEffect(() => {
        searchDoctors({
            ...searchCriteria,
            page: paginationModel.page,
            size: paginationModel.pageSize,
        });
    }, [paginationModel.page, paginationModel.pageSize]);

    return (
        <>
            <Navbar />
            <form
                onSubmit={handleSubmit(onSearchSubmit)}
                className="formWrapper"
            >
                <Box
                    sx={{
                        mt: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Box sx={{ width: { xs: "350px", sm: "800px" } }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Box sx={{ width: { xs: "100%", sm: "33%" } }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Full Name
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder="Full Name"
                                    {...register("fullName")}
                                    sx={{ width: "100%" }}
                                />
                            </Box>
                            <Box sx={{ width: { xs: "100%", sm: "33%" } }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Specialization
                                </Typography>
                                <DropdownBox
                                    label="Select specialization"
                                    name="specialization"
                                    register={register}
                                    setValue={setValue}
                                    options={specializations.map((spec) => ({
                                        value: spec.specializationName, // value to be stored in form
                                        label: spec.specializationName, // label to be displayed
                                    }))}
                                    error={errors.specialization}
                                    helperText={errors.specialization?.message}
                                />
                            </Box>
                            <Box sx={{ width: { xs: "100%", sm: "33%" } }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Career Level
                                </Typography>
                                <DropdownBox
                                    label="Select career level"
                                    name="careerLevel"
                                    register={register}
                                    setValue={setValue}
                                    options={careerLevels.map((spec) => ({
                                        value: spec.careerLevelName, // value to be stored in form
                                        label: spec.careerLevelName, // label to be displayed
                                    }))}
                                    error={errors.careerLevel}
                                    helperText={errors.careerLevel?.message}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ width: { xs: "100%", sm: "33%" } }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Select Date
                                </Typography>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        label="Choose date"
                                        value={selectedDate}
                                        onChange={(newValue) => {
                                            setSelectedDate(newValue);
                                            setValue(
                                                "appointmentDate",
                                                newValue
                                            );
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.appointmentDate,
                                                helperText:
                                                    errors.appointmentDate
                                                        ?.message,
                                            },
                                        }}
                                        minDate={dayjs()}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ width: { xs: "100%", sm: "33%" } }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Select Time
                                </Typography>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <TimePicker
                                        label="Choose time"
                                        value={selectedTime}
                                        onChange={(newValue) => {
                                            setSelectedTime(newValue);
                                            setValue(
                                                "appointmentTime",
                                                newValue
                                            );
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.appointmentTime,
                                                helperText:
                                                    errors.appointmentTime
                                                        ?.message,
                                            },
                                        }}
                                        minTime={
                                            selectedDate &&
                                                dayjs(selectedDate).isSame(
                                                    dayjs(),
                                                    "day"
                                                )
                                                ? dayjs()
                                                : null
                                        }
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ width: { xs: "100%", sm: "33%" } }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        mt: 4,
                                        width: "100%",
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                        textTransform: "none",
                                        bgcolor: "#33b4d4",
                                        "&:hover": { bgcolor: "#2c3e50" },
                                    }}
                                >
                                    Search
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </form>
{/* DataGrid */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        height: 500,
                        maxWidth: { xs: 400, sm: 600, md: 1200 },
                        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <DataGrid
                        rows={rows.filter(row => row.doctorId !== userId )}
                        columns={columns}
                        rowCount={rowCount}
                        loading={loading}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={handlePaginationModelChange}
                        pageSizeOptions={[7, 10, 25, 50]}
                        pagination
                        disableRowSelectionOnClick
                        sx={{
                            "& .MuiDataGrid-cell": {
                                borderBottom:
                                    "1px solid rgba(224, 224, 224, 0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                "&:focus": { outline: "none" },
                            },
                            "& .header": {
                                backgroundColor: "#33b4d4",
                                color: "white",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                px: 2,
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "rgba(63, 81, 181, 0.08)",
                            },
                            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                            {
                                margin: 0,
                            },
                            "& .MuiDataGrid-columnHeader": {
                                display: "flex",
                                justifyContent: "center",
                                "& .MuiDataGrid-columnSeparator": {
                                    width: "2px",
                                    background: "rgba(255, 255, 255, 0.6)",
                                },
                            },
                        }}
                    />
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default Appointment;
