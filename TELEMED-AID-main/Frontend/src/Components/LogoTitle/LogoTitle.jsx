import React from "react";
import { Box } from "@mui/material";

const LogoTitle = ({ isDisabled }) => {

  return (
    <Box
      component="img"
      src={require("../../Assets/logo.png")}
      alt="Project Logo"
      sx={{
        mt: 4,
        height: { xs: 100, sm: 150, md: 150 }, // responsive sizing
        width: "auto",
        maxWidth: "100%",
        display: "block",
        mx: "auto", // centers horizontally
      }}
    />
  );
};

export default LogoTitle;
