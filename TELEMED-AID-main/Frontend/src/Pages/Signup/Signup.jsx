import React, { use, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Grid,
    IconButton,
    InputAdornment,
} from "@mui/material";
import LogoTitle from "../../Components/LogoTitle/LogoTitle";
import SignupPageStyle from "./SignupPageStyle";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { countries } from "../../Utils/HelperObjects";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { submitFormWithValidation } from "../../Utils/Validations/FormValidation";
import {
    DropDownValidation,
    NationalIdValidation,
    NameValidation,
    pastOrNowDateValidation,
    PhoneValidation,
    WithoutValidation,
    PasswordValidation,
} from "../../Utils/Validations/ValidationSchema";
import {
    GET_VERIFICATION_LINK,
    USER_SIGNUP_DOCTOR_URL,
    USER_SIGNUP_PATIENT_URL,
} from "../../API/APIRoutes";
import Joi from "joi";
import SearchableDropDown from "../../Components/DropDown/SearchableDropDown";
import usePostItem from "../../Hooks/usePost";
import useGet from "../../Hooks/useGet";
import TimerIcon from "@mui/icons-material/Timer";
import LoadingComponent from "../../Components/LoadingComponent/LoadingComponent";
export default function Signup() {
    const { handleSubmit, setValue } = useForm();
    const [specializations, setSpecializations] = useState([]);
    const [careerLevels, setCareerLevels] = useState([]);
    const [loadingSpecializations, setLoadingSpecializations] = useState(false);
    const [loadingCareerLevels, setLoadingCareerLevels] = useState(false);
    let validationSchema = Joi.object({
        name: NameValidation("Full Name"),
        nationalId: NationalIdValidation("National Id"),
        countryName: DropDownValidation("Country Name", false),
        countryId: WithoutValidation,
        phone: PhoneValidation("Phone Number"),
        dateOfBirth: pastOrNowDateValidation,
        gender: DropDownValidation("Gender", false),
        password: PasswordValidation("Password"),
        inquiryId: WithoutValidation,
        role: WithoutValidation,
    });

    const initialFormState = {
        name: "",
        nationalId: "",
        countryName: "",
        countryId: "",  // Add this field
        phone: "",
        dateOfBirth: "",
        gender: "",
        password: "",
        specializationName: "",
        careerLevelName: "",
        inquiryId: "",
        role: "",
    };

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignupButtonEnabled, setIsSignupButtonEnabled] = useState(
        localStorage.getItem("inquiryId") ? true : false
    );
    const [inquiryId, setInquiryId] = useState(
        localStorage.getItem("inquiryId")
            ? localStorage.getItem("inquiryId")
            : ""
    );
    const [requestState, setRequestState] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    const { loading: signupLoading, postItem } = usePostItem();
    const { loading: getInquiryIdLoading, getItem } = useGet();
    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const toggelRole = async (state) => {
        setIsDoctor(state);
    };
    const findCountryPhoneCode = (countryName) => {
        let country = countries.find((country) => country.name === countryName);
        return {
            phoneCode: country?.phoneCode,
            countryId: country?.code  // Add this line
        };
    };

    const getVerificationLink = (data) => {
        console.log("data: ", data);
        window.open(data.verificationLink, "_blank");
        setInquiryId(data.inquiryId);
        localStorage.setItem("inquiryId", data.inquiryId);
        setRequestState((prev) => ({
            ...prev,
            inquiryId: data.inquiryId,
        }));
        localStorage.setItem("lastClickTime", Date.now());
        setIsVerificationButtonEnabled(false);
        setIsSignupButtonEnabled(true);
    };

    const [isVerificationButtonEnabled, setIsVerificationButtonEnabled] =
        useState(localStorage.getItem("lastClickTime") ? false : true);
    const [timeRemaining, setTimeRemaining] = useState(0);
    useEffect(() => {
        if (isDoctor) {
            // Fetch specializations
            setLoadingSpecializations(true);
            getItem(
                '/api/doctor/specialization', // Adjust this endpoint as needed
                false,
                (response) => {
                    setSpecializations(response);
                    setLoadingSpecializations(false);
                },
                (error) => {
                    console.error("Error fetching specializations:", error);
                    setLoadingSpecializations(false);
                }
            );

            // Fetch career levels
            setLoadingCareerLevels(true);
            getItem(
                '/api/doctor/career-level', // Adjust this endpoint as needed
                false,
                (response) => {
                    setCareerLevels(response);
                    setLoadingCareerLevels(false);
                },
                (error) => {
                    console.error("Error fetching career levels:", error);
                    setLoadingCareerLevels(false);
                }
            );
        }
    }, [isDoctor]);
    useEffect(() => {
        const lastClickTime = localStorage.getItem("lastClickTime");

        if (lastClickTime) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - lastClickTime;

            if (elapsedTime >= 1800000) {
                setIsVerificationButtonEnabled(true);
            } else {
                setTimeRemaining(1800000 - elapsedTime);
            }
        }

        const intervalId = setInterval(() => {
            if (isVerificationButtonEnabled) return;
            setTimeRemaining((prevTime) => {
                if (prevTime <= 1000) {
                    setIsVerificationButtonEnabled(true);
                    localStorage.removeItem("lastClickTime"); // Clear stored time after 30 minutes
                    return 0;
                }
                return prevTime - 1000; // Decrease by 1 second
            });
        }, 1000); // Update every second for countdown

        return () => clearInterval(intervalId);
    }, [isVerificationButtonEnabled]);

    const handleValidationIdentityButton = () => {
        console.log("handleValidationIdentityButton ... ");
        getItem(GET_VERIFICATION_LINK, false, getVerificationLink);
        //api call to get verification link
    };
    const validatePasswordMatch = () => {
        if (requestState.password !== confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: "Passwords do not match",
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: "",
            }));
        }
    };

    const signupRequestCallBack = (responseData, originalData) => {
        localStorage.removeItem("inquiryId");
        setIsVerificationButtonEnabled(true);
        setIsSignupButtonEnabled(false);
        navigate("/");
    };

    const onSignupSubmit = async () => {
        const currentInquiryId = localStorage.getItem("inquiryId") || "";
        // Update requestState with role and inquiryId
        const updatedRequestState = {
            ...requestState,
            role: isDoctor ? "DOCTOR" : "PATIENT",
            inquiryId: "inq_z5hXEQxdWAZKjsyGQtThHZx9XciB", // Add this line
            countryId: requestState.countryId,
        };
        console.log(updatedRequestState);
        if (!isDoctor) {
            const {
                specializationName,
                careerLevelName,
                ...patientRequestState
            } = updatedRequestState;
            console.log(patientRequestState);
            const patientRequest = await submitFormWithValidation(
                patientRequestState,
                false,
                null,
                setErrors,
                validationSchema
            );
            validatePasswordMatch();

            if (patientRequest == null) {
                return;
            }
            // api to call request for user signup user request
            postItem(
                USER_SIGNUP_PATIENT_URL,
                patientRequest,
                signupRequestCallBack,
                "Signup Success",
                null,
                () => { },
                true,
                "post"
            );
        } else {
            console.log("hi");
            validationSchema = validationSchema.keys({
                specializationName: DropDownValidation("Specialization", false),
                careerLevelName: DropDownValidation("Career Level", false),
            });
            const doctorRequest = await submitFormWithValidation(
                updatedRequestState, // Use updated state
                false,
                null,
                setErrors,
                validationSchema
            );

            validatePasswordMatch();
            console.log(doctorRequest);
            console.log("->>>> ", Object.keys(errors).length);
            if (doctorRequest == null) {
                return;
            }
            console.log("doctorRequest");
            postItem(
                USER_SIGNUP_DOCTOR_URL,
                doctorRequest,
                signupRequestCallBack,
                "Signup Success",
                null,
                () => { },
                true,
                "post"
            );
            // api to call request for user signup doctor request
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <SignupPageStyle>
            <LogoTitle />
            <form
                onSubmit={handleSubmit(onSignupSubmit)}
                className="formWrapper"
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        // alignItems: "center",
                        mb: 10,
                    }}
                >
                    <Box sx={{ width: { xs: "350px", sm: "800px" } }}>
                        <Grid>
                            <Typography variant="h3" className="loginTitle">
                                Signup Page
                            </Typography>
                        </Grid>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on desktop
                                gap: 2, // Consistent spacing between items
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Full Name
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder="Full Name"
                                    value={requestState.name}
                                    onChange={(e) => {
                                        setRequestState({
                                            ...requestState,
                                            name: e.target.value,
                                        });
                                        setErrors({ ...errors, name: "" });
                                    }}
                                    sx={{ width: "100%" }}
                                    helperText={errors?.name}
                                />
                            </Box>

                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    National ID
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder="National ID"
                                    value={requestState.nationalId}
                                    onChange={(e) => {
                                        setRequestState({
                                            ...requestState,
                                            nationalId: e.target.value,
                                        });
                                        setErrors({
                                            ...errors,
                                            nationalId: "",
                                        });
                                    }}
                                    helperText={errors?.nationalId}
                                    sx={{ mb: 2, width: "100%" }}
                                />
                            </Box>
                        </Box>

                        {/* ***************************** */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on desktop
                                gap: 2, // Consistent spacing between items
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Country
                                </Typography>
                                <SearchableDropDown
                                    placeholder="Select your country"
                                    name="country"
                                    state={requestState.countryName}
                                    setState={(value) => {
                                        const countryInfo = findCountryPhoneCode(value);
                                        setRequestState({
                                            ...requestState,
                                            countryName: value,
                                            countryId: countryInfo.countryId  // Store the country code
                                        });
                                        setErrors({
                                            ...errors,
                                            countryName: "",
                                        });
                                    }}
                                    helperText={errors?.countryName}
                                    items={countries}
                                />
                            </Box>

                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Phone Number
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Phone Number"
                                    helperText={errors?.phone}
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {findCountryPhoneCode(
                                                    requestState.countryName
                                                ).phoneCode}
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => {
                                        setRequestState({
                                            ...requestState,
                                            phone: e.target.value,
                                        });
                                        setErrors({ ...errors, phone: "" });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* ***************************** */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on desktop
                                gap: 2, // Consistent spacing between items
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Date of Birth
                                </Typography>
                                <TextField
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    helperText={errors?.dateOfBirth}
                                    onChange={(e) => {
                                        setRequestState({
                                            ...requestState,
                                            dateOfBirth: e.target.value,
                                        });
                                        setErrors({
                                            ...errors,
                                            dateOfBirth: "",
                                        });
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Gender
                                </Typography>
                                <SearchableDropDown
                                    placeholder="Select your gender"
                                    name="gender"
                                    state={requestState.gender}
                                    setState={(value) => {
                                        setRequestState({
                                            ...requestState,
                                            gender: value,
                                        });
                                        setErrors({ ...errors, gender: "" }); // Clear error message on selection
                                    }}
                                    helperText={errors?.gender}
                                    items={[
                                        { name: "Male" },
                                        { name: "Female" },
                                    ]}
                                />
                            </Box>
                        </Box>
                        {/* ***************************** */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on desktop
                                gap: 2, // Consistent spacing between items
                                justifyContent: "space-evenly",
                                mt: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Password
                                </Typography>
                                <TextField
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    placeholder="Password"
                                    helperText={errors?.password}
                                    onChange={(e) => {
                                        setRequestState({
                                            ...requestState,
                                            password: e.target.value,
                                        });
                                        setErrors({ ...errors, password: "" });
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={
                                                        handleTogglePassword
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Confirm Password
                                </Typography>
                                <TextField
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    placeholder="Confirm Password"
                                    helperText={errors?.confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrors({
                                            ...errors,
                                            confirmPassword: "",
                                        });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* ********************* */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "1.1rem",
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{ fontSize: "1rem", fontWeight: "bold" }}
                            >
                                Are You a Doctor?
                            </Typography>
                            <IconButton onClick={() => toggelRole(!isDoctor)}>
                                {isDoctor ? (
                                    <ToggleOnIcon
                                        color="primary"
                                        sx={{ fontSize: 50 }}
                                    />
                                ) : (
                                    <ToggleOffIcon
                                        color="disabled"
                                        sx={{ fontSize: 50 }}
                                    />
                                )}
                            </IconButton>
                        </Box>

                        {isDoctor && (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", sm: "row" },
                                        gap: 2,
                                        justifyContent: "space-evenly",
                                        mb: 2,
                                    }}
                                >
                                    <Box sx={{ width: { xs: "100%", sm: "45%" } }}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Specialization
                                        </Typography>
                                        {loadingSpecializations ? (
                                            <LoadingComponent size="1.5rem" thickness={4} />
                                        ) : (
                                            <SearchableDropDown
                                                placeholder="Select your specialization"
                                                name="specialization"
                                                state={requestState.specializationName}
                                                setState={(value) => {
                                                    setRequestState({
                                                        ...requestState,
                                                        specializationName: value,
                                                    });
                                                    setErrors({
                                                        ...errors,
                                                        specializationName: "",
                                                    });
                                                }}
                                                helperText={errors?.specializationName}
                                                items={specializations.map(spec => ({
                                                    name: spec.specializationName || spec.name
                                                }))}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ width: { xs: "100%", sm: "45%" } }}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Career Level
                                        </Typography>
                                        {loadingCareerLevels ? (
                                            <LoadingComponent size="1.5rem" thickness={4} />
                                        ) : (
                                            <SearchableDropDown
                                                placeholder="Select your career level"
                                                name="career"
                                                state={requestState.careerLevelName}
                                                setState={(value) => {
                                                    setRequestState({
                                                        ...requestState,
                                                        careerLevelName: value,
                                                    });
                                                    setErrors({
                                                        ...errors,
                                                        careerLevelName: "",
                                                    });
                                                }}
                                                helperText={errors?.careerLevelName}
                                                items={careerLevels.map(level => ({
                                                    name: level.careerLevelName || level.name
                                                }))}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </>
                        )}
                        {/* ************************ */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on desktop
                                gap: 2, // Consistent spacing between items
                                justifyContent: "space-evenly",
                                mt: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        width: "100%",
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                        textTransform: "none",
                                        bgcolor: "#c2185b",
                                        "&:hover": { bgcolor: "#880e4f" },
                                        display: "block", // Required for margin auto to work
                                        mx: "auto", // Horizontal margin auto
                                        mb: 2, // Optional bottom margin
                                        opacity: isVerificationButtonEnabled
                                            ? 1
                                            : 0.7, // Make the button slightly transparent when disabled
                                    }}
                                    disabled={
                                        !isVerificationButtonEnabled ||
                                        getInquiryIdLoading
                                    }
                                    onClick={handleValidationIdentityButton}
                                >
                                    {!getInquiryIdLoading ? (
                                        "Validate Your Identity"
                                    ) : (
                                        <LoadingComponent
                                            size="1.2rem"
                                            thickness={5}
                                            color="white"
                                        />
                                    )}{" "}
                                </Button>
                                {!isVerificationButtonEnabled && (
                                    <TimerIcon sx={{ mr: 1 }} />
                                )}

                                {!isVerificationButtonEnabled &&
                                    `Verification available in  ${formatTime(
                                        timeRemaining
                                    )}`}
                            </Box>
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on desktop
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={
                                        !isSignupButtonEnabled || signupLoading
                                        // false
                                    }
                                    sx={{
                                        width: "100%",
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                        textTransform: "none",
                                        bgcolor: "#33b4d4",
                                        "&:hover": { bgcolor: "#2a9cb3" },
                                        display: "block",
                                        mx: "auto", // Horizontal margin auto
                                        mb: 2, // Optional bottom margin
                                    }}
                                >
                                    {!signupLoading ? (
                                        "Sign Up"
                                    ) : (
                                        <LoadingComponent
                                            size="1.2rem"
                                            thickness={5}
                                            color="white"
                                        />
                                    )}{" "}
                                </Button>
                            </Box>
                        </Box>

                        <Typography
                            variant="body1"
                            align="center"
                            sx={{ mt: 2, fontSize: "1rem" }}
                        >
                            Do you have an account?{" "}
                            <Link
                                component="button"
                                underline="hover"
                                sx={{ fontSize: "1rem" }}
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </form>
        </SignupPageStyle>
    );
}
