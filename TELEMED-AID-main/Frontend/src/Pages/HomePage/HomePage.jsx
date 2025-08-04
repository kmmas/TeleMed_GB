import React from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import chatImg from "../../Assets/chat.png";
import appointmentImg from "../../Assets/Appointment.png";
import articlesImg from "../../Assets/articles.png";
import availabilityImg from "../../Assets/availability.png";
import doctorsImg from "../../Assets/doctors.png";
import voteImg from "../../Assets/vote.png";
import questionsImg from "../../Assets/questions.png";
import Navbar from "../../Components/Navbar/Navbar"; // Adjust path as needed
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import Footer from "../../Components/Footer/Footer";
const features = [
    {
        title: "Easy Signup & Login",
        description:
            "New users can quickly register as patients or doctors. The system provides a secure and user-friendly authentication process to ensure safe access to personal healthcare data.",
        image: doctorsImg,
        route: "/signup",
    },
    {
        title: "Book Appointments",
        description:
            "Patients can view doctor availability and schedule appointments that fit both their preferences and the doctor’s open time slots. The booking system ensures there are no overlaps or conflicts.",
        image: appointmentImg,
        route: "/book-appointment",
    },
    {
        title: "Doctor Availability Management",
        description:
            "Doctors have full control over their working hours. They can set, update, or remove their available time slots, helping patients find the right time for consultation effortlessly.",
        image: availabilityImg,
        route: "/availability",
    },
    {
        title: "Post Health Questions",
        description:
            "Patients can post detailed medical or wellness-related questions. These are publicly visible to registered doctors, encouraging community-based knowledge sharing and support.",
        image: questionsImg,
        route: "/ShowQuestions",
    },
    {
        title: "Doctor Answers & Voting System",
        description:
            "Doctors can respond to patient questions and vote on other doctors' answers to highlight the most helpful responses. This peer-review approach helps patients trust the best advice.",
        image: voteImg,
        route: "/showQuestions",
    },
    {
        title: "Publish Medical Articles",
        description:
            "Doctors can share their expertise by posting health-related articles. These articles help educate patients and establish the doctor’s credibility within the platform.",
        image: articlesImg,
        route: "/showArticles",
    },
    {
        title: "Live Chat During Appointments",
        description:
            "At the time of the appointment, patients and doctors can engage in real-time chat. This feature allows efficient remote consultations without the need for physical visits. Note: You can create a chatting room from the profile",
        image: chatImg,
        route: "/chat",
    },
];

const FeatureCard = ({ feature, isReversed }) => {
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <Card
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: {
                        xs: "column", // Stack vertically on mobile
                        md: isReversed ? "row-reverse" : "row", // Row layout on desktop
                    },
                    justifyContent: "center",
                    alignItems: "center",
                    mb: { xs: 5, md: 10 }, // Smaller margin on mobile
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: "hidden",
                }}
            >
                {/* Image - Full width on mobile, 50% on desktop */}
                <Box
                    sx={{
                        width: { xs: "90%", md: "50%" },
                        height: { xs: "250px", md: "auto" }, // Fixed height on mobile
                    }}
                >
                    <img
                        src={feature.image}
                        alt={feature.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Box>

                {/* Text - Full width on mobile, 50% on desktop */}
                <Box
                    sx={{
                        width: { xs: "90%", md: "50%" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <CardContent
                        sx={{
                            ml: { xs: 0, md: 2 }, // No margin on mobile
                            p: { xs: 2, md: 3 }, // Adjust padding for mobile
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontFamily: "'Roboto', sans-serif",
                                fontWeight: 700,
                                fontSize: { xs: "1.8rem", md: "2.125rem" }, // Smaller on mobile
                            }}
                        >
                            {feature.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                            sx={{
                                fontSize: { xs: "16px", md: "20px" }, // Smaller on mobile
                            }}
                        >
                            {feature.description}
                        </Typography>
                        <Button
                            variant="contained"
                            href={feature.route}
                            sx={{
                                fontSize: { xs: "16px", md: "20px" },
                                mt: 2,
                                backgroundColor: "#33b4d4",
                                "&:hover": {
                                    backgroundColor: "#2a96b3",
                                },
                            }}
                        >
                            {feature.title}
                        </Button>
                    </CardContent>
                </Box>
            </Card>
        </motion.div>
    );
};

const Home_page = () => {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Container sx={{ mt: 8, p: 0 }}>
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        feature={feature}
                        isReversed={index % 2 !== 0}
                    />
                ))}
            </Container>
            <Footer />
        </>
    );
};

export default Home_page;
