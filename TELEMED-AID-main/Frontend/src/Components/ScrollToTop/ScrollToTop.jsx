import React, { useEffect } from "react";
import {
  Fab,
  Zoom,
  useScrollTrigger,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useLocation } from "react-router-dom"; // Import this

const ScrollToTop = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const location = useLocation(); // Get current route

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Automatically scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Zoom in={trigger}>
      <Box
        onClick={scrollToTop}
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 50,
          right: isMobile ? 25 : 60,
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          size={isMobile ? "medium" : "large"}
          aria-label="Scroll to top"
          sx={{
            backgroundColor: "#33b4d4",
            "&:hover": {
              backgroundColor: "#2a96b3",
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollToTop;
