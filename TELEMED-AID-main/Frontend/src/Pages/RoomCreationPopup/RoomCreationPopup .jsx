import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Chip,
    Box,
    Typography,
    Divider,
    IconButton,
    Avatar,
    ListItemAvatar
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PersonIcon from '@mui/icons-material/Person';

const generateRandomRoomName = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `Room_${randomString}`;
};

const RoomCreationPopup = ({ open, onClose, users, onCreateRoom }) => {
    const [roomName, setRoomName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Regenerate room name when dialog opens
    useEffect(() => {
        if (open) {
            setRoomName(generateRandomRoomName());
            setSelectedUsers([]); // Reset selections when reopening
        }
    }, [open]);

    const handleRefreshName = () => {
        setRoomName(generateRandomRoomName());
    };

    const handleCreateRoom = () => {
        if (typeof onCreateRoom === "function") {
            onCreateRoom(roomName, selectedUsers);
        }
        onClose();
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            disableRestoreFocus
        >
            <DialogTitle>Create New Chat Room</DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <IconButton
                        onClick={handleRefreshName}
                        aria-label="refresh room name"
                        sx={{ mb: 3 }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                <TextField
                    margin="dense"
                    label="Search Users"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Typography variant="subtitle1" gutterBottom>
                    Select Participants ({selectedUsers.length} selected)
                </Typography>

                {selectedUsers.length > 0 && (
                    <Box
                        sx={{
                            mb: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        {selectedUsers.map((userId) => {
                            const user = users.find((u) => u.id === userId);
                            return (
                                <Chip
                                    key={userId}
                                    label={user?.name}
                                    avatar={
                                        <Avatar sx={{ width: 24, height: 24 }}>
                                            {user?.role === "DOCTOR" ? (
                                                <MedicalInformationIcon fontSize="small" />
                                            ) : (
                                                <PersonIcon fontSize="small" />
                                            )}
                                        </Avatar>
                                    }
                                    onDelete={() => toggleUserSelection(userId)}
                                    color={user?.role === "DOCTOR" ? "primary" : "default"}
                                />
                            );
                        })}
                    </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <ListItem 
                                key={user.id}
                                button
                                onClick={() => toggleUserSelection(user.id)}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: user.role === "DOCTOR" ? '#33b4d4' : 'primary' }}>
                                        {user.role === "DOCTOR" ? (
                                            <MedicalInformationIcon />
                                        ) : (
                                            <PersonIcon />
                                        )}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={
                                        user.role === "DOCTOR" ? (
                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                <Chip 
                                                    label={user.specialization} 
                                                    size="small" 
                                                    color="primary" 
                                                    variant="outlined"
                                                />
                                                <Chip 
                                                    label={user.careerLevel} 
                                                    size="small" 
                                                    color="secondary" 
                                                    variant="outlined"
                                                />
                                            </Box>
                                        ) : (
                                            "Patient"
                                        )
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                        color={user.role === "DOCTOR" ? "primary" : "default"}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No users found" />
                        </ListItem>
                    )}
                </List>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        fontSize: "1.1rem",
                        textTransform: "none",
                        color: '#c2185b',
                        '&:hover': {
                            backgroundColor: 'rgba(194, 24, 91, 0.08)'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleCreateRoom}
                    variant="contained"
                    disabled={!roomName || selectedUsers.length === 0}
                    sx={{
                        fontSize: "1.1rem",
                        textTransform: "none",
                        bgcolor: "#33b4d4",
                        "&:hover": { bgcolor: "#2a9cb3" },
                    }}
                >
                    Create Room
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoomCreationPopup;