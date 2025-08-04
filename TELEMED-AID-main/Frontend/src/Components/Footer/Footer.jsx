import React from "react";
import {
    Box,
    Container,
    Typography,
    Link,
    Divider,
    IconButton,
} from "@mui/material";
import { Facebook, Twitter, LinkedIn, Email } from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#f5f5f5",
                py:3,
                mt: 10,
            }}
        >
            <Container maxWidth="lg">
                    {/* Logo and description */}
                    <Box sx={{ mb: 4, textAlign: "center" }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                background:
                                    "linear-gradient(to right, black, #2a96b3)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Telemid-Aid
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ maxWidth: 600, mx: "auto" }}
                        >
                            Bridging healthcare gaps through innovative
                            telemedicine solutions.
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2, borderWidth: "1px" }} />

                    {/* Links and contact */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "space-between",
                            // alignItems: "center",
                        }}
                    >
                        {/* Quick Links */}
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ mb: 1, fontWeight: 600 }}
                            >
                                Quick Links
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <Link
                                    href="/home"
                                    color="inherit"
                                    underline="hover"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/home"
                                    color="inherit"
                                    underline="hover"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/home"
                                    color="inherit"
                                    underline="hover"
                                >
                                    Services
                                </Link>
                                <Link
                                    href="/home"
                                    color="inherit"
                                    underline="hover"
                                >
                                    Contact
                                </Link>
                            </Box>
                        </Box>

                        {/* Contact Info */}
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ mb: 1, fontWeight: 600 }}
                            >
                                Contact Us
                            </Typography>
                            <Typography>Alexandria University</Typography>
                            <Typography>
                                Computer and Systems Engineering Department
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                <Link
                                    href="mailto:contact@telemidaid.com"
                                    color="inherit"
                                    underline="hover"
                                >
                                    contact@telemidaid.com
                                </Link>
                            </Typography>
                        </Box>

                        {/* Social Media */}
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ mb: 1, fontWeight: 600 }}
                            >
                                Follow Us
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton aria-label="Facebook" href="#">
                                    <Facebook />
                                </IconButton>
                                <IconButton aria-label="Twitter" href="#">
                                    <Twitter />
                                </IconButton>
                                <IconButton aria-label="LinkedIn" href="#">
                                    <LinkedIn />
                                </IconButton>
                                <IconButton
                                    aria-label="Email"
                                    href="mailto:contact@telemidaid.com"
                                >
                                    <Email />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        © {currentYear} Telemid-Aid. All rights reserved.
                    </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
