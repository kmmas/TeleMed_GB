// src/Pages/Unauthorized/Unauthorized.jsx
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h4" gutterBottom>
                Access Denied
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                You don't have permission to access this page.
            </Typography>
            <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
                Return to Home
            </Button>
        </Box>
    );
}
