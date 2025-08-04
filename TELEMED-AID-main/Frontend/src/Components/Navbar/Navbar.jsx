import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Container,
    useScrollTrigger,
    Slide,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Badge,
    Popover,
    Typography,
    Paper,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import {
    SmartToy as RobotIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import logo from "../../Assets/logo.png";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import useGet from "../../Hooks/useGet";
import { formatDistanceToNow } from "date-fns";

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const activeGradient = {
    background: "linear-gradient(135deg, #b3e5fc 0%, #e1f5fe 60%)",
    color: "text.primary",
    borderRadius: "4px",
};

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const location = useLocation();
    const { getItem } = useGet();

    // Get current user from Redux store
    const { userId } = useSelector((state) => state.user);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMailClick = (event) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications();
    };

    const handleMailClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        localStorage.clear();
        try {
            // Send logout request to the backend
            const response = await fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                credentials: 'include', // This is important for cookies to be sent/received
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                // Clear any client-side authentication state
                localStorage.removeItem('user'); // or whatever you use to store user data
                // Optionally redirect to login page
                window.location.href = '/login';
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        try {
            const data = await getItem("/notification/public/patients", false);
            console.log("Notifications data:", data);
            if (data) {
                // Filter notifications based on type and targetId
                const filteredNotifications = data.filter(
                    (notification) =>
                        notification.type === "ALL_PATIENTS" ||
                        (notification.type === "PRIVATE" &&
                            notification.targetId === userId)
                );
                setNotifications(filteredNotifications);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? "mail-popover" : undefined;

    const navItems = [
        { name: "Home", path: "/home" },
        { name: "Profile", path: "/profile" },
        { name: "My Appointments", path: "/my-appointments" },
        { name: "Book an Appointment", path: "/book-appointment" },
        { name: "Articles", path: "/ShowArticles" },
        { name: "Questions", path: "/ShowQuestions" },
        { name: "Chat Room", path: "/chat" },
    ];

    const drawer = (
        <Box sx={{ textAlign: "center", width: 250 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <img
                    src={logo}
                    alt="Telemid-Aid Logo"
                    style={{ height: "40px" }}
                />
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem
                        key={item.name}
                        component={Link}
                        to={item.path}
                        onClick={handleDrawerToggle}
                        sx={{
                            my: 0.5,
                            mx: 1,
                            borderRadius: "4px",
                            ...(location.pathname === item.path
                                ? activeGradient
                                : {
                                      color: "inherit",
                                      "&:hover": {
                                          color: "#33b4d4",
                                          backgroundColor:
                                              "rgba(51, 180, 212, 0.04)",
                                      },
                                  }),
                        }}
                    >
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem
                    onClick={handleMailClick}
                    sx={{
                        color: "text.primary",
                        "&:hover": {
                            color: "#33b4d4",
                            cursor: "pointer",
                        },
                    }}
                >
                    <Badge
                        badgeContent={notifications.length}
                        color="info"
                        sx={{ mr: 2 }}
                    >
                        <MailIcon />
                    </Badge>
                    <ListItemText primary="Notifications" />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleLogout}
                        sx={{
                            mx: 1,
                            fontSize: "18px",
                            backgroundColor: "#33b4d4",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#424242",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            {/* Floating Robot Icon Button - Top Right */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 140,
                    right: 58,
                    zIndex: 1200,
                }}
            >
                <Tooltip title="Medical Chatbot" arrow>
                    <IconButton
                        component={Link}
                        to="/chatbot"
                        sx={{
                            backgroundColor: "#33b4d4",
                            color: "white",
                            width: 58,
                            height: 58,
                            "&:hover": {
                                backgroundColor: "#2a96b3",
                                transform: "scale(1.1)",
                            },
                            transition: "all 0.3s ease",
                            boxShadow: 3,
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                                "0%": {
                                    boxShadow:
                                        "0 0 0 0 rgba(51, 180, 212, 0.7)",
                                },
                                "70%": {
                                    boxShadow:
                                        "0 0 0 10px rgba(51, 180, 212, 0)",
                                },
                                "100%": {
                                    boxShadow: "0 0 0 0 rgba(51, 180, 212, 0)",
                                },
                            },
                        }}
                    >
                        <RobotIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            <HideOnScroll>
                <AppBar
                    position="sticky"
                    color="black"
                    elevation={1}
                    sx={{
                        py: 1,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            {/* Logo */}
                            <Box
                                component={Link}
                                to="/home"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    textDecoration: "none",
                                    flexGrow: { xs: 1, md: 0 },
                                }}
                            >
                                <img
                                    src={logo}
                                    alt="Telemid-Aid Logo"
                                    style={{
                                        height: "55px",
                                    }}
                                />
                            </Box>

                            {/* Desktop Navigation */}
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: "none", md: "flex" },
                                }}
                            >
                                {navItems.map((item) => (
                                    <Button
                                        key={item.name}
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            mx: 1,
                                            mt: 1,
                                            fontSize: "18px",
                                            ...(location.pathname === item.path
                                                ? activeGradient
                                                : {
                                                      color: "text.primary",
                                                      "&:hover": {
                                                          color: "#33b4d4",
                                                          backgroundColor:
                                                              "transparent",
                                                      },
                                                  }),
                                        }}
                                    >
                                        {item.name}
                                    </Button>
                                ))}
                            </Box>

                            {/* Mobile Menu Button */}
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{
                                    display: { md: "none" },
                                    mr: 1,
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Box
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <IconButton
                                    onClick={handleMailClick}
                                    sx={{
                                        mx: 1,
                                        "&:hover": {
                                            color: "#33b4d4",
                                            backgroundColor:
                                                "rgba(51, 180, 212, 0.04)",
                                        },
                                    }}
                                >
                                    <Badge
                                        badgeContent={notifications.length}
                                        color="info"
                                    >
                                        <MailIcon />
                                    </Badge>
                                </IconButton>

                                {/* Notification Popover */}
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleMailClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <Paper sx={{ p: 2, width: 350 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 1,
                                            }}
                                        >
                                            <Typography variant="h6">
                                                Notifications
                                            </Typography>
                                            <Button
                                                size="small"
                                                onClick={fetchNotifications}
                                                disabled={loadingNotifications}
                                                startIcon={
                                                    loadingNotifications ? (
                                                        <CircularProgress
                                                            size={14}
                                                        />
                                                    ) : null
                                                }
                                            >
                                                Refresh
                                            </Button>
                                        </Box>
                                        <Divider sx={{ mb: 1 }} />
                                        {loadingNotifications &&
                                        notifications.length === 0 ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    p: 2,
                                                }}
                                            >
                                                <CircularProgress size={24} />
                                            </Box>
                                        ) : notifications.length > 0 ? (
                                            <Box
                                                sx={{
                                                    maxHeight: 400,
                                                    overflow: "auto",
                                                }}
                                            >
                                                {notifications.map(
                                                    (notification) => (
                                                        <Box
                                                            key={
                                                                notification._id
                                                            }
                                                            sx={{
                                                                mb: 2,
                                                                p: 1.5,
                                                                borderRadius: 1,
                                                                backgroundColor:
                                                                    "background.paper",
                                                                boxShadow: 1,
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "center",
                                                                    mb: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            notification.timestamp
                                                                        ),
                                                                        {
                                                                            addSuffix: true,
                                                                        }
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{ mb: 1 }}
                                                            >
                                                                {
                                                                    notification.message
                                                                }
                                                            </Typography>
                                                            {notification.type ===
                                                                "PRIVATE" && (
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        fontStyle:
                                                                            "italic",
                                                                    }}
                                                                >
                                                                    Private
                                                                    message
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    )
                                                )}
                                            </Box>
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    p: 2,
                                                    textAlign: "center",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                No notifications available
                                            </Typography>
                                        )}
                                    </Paper>
                                </Popover>

                                {/* Logout Button */}
                                <Button
                                    variant="contained"
                                    onClick={handleLogout}
                                    sx={{
                                        mx: 1,
                                        fontSize: "18px",
                                        backgroundColor: "#33b4d4",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "#424242",
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            {/* Mobile Drawer */}
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: 250,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
};

export default Navbar;
