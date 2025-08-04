import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Avatar,
    IconButton,
    Tooltip,
    Fade
} from '@mui/material';
import { blue, grey, green, indigo } from '@mui/material/colors';
import { Send, SmartToy, Person, AutoFixHigh, Delete } from '@mui/icons-material';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const controllerRef = useRef(null);

    // Remove the auto-scroll useEffect since we don't want auto-scrolling anymore
    // Also removed initialRender ref since we don't need it anymore

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // Create new AbortController for each request
        controllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => controllerRef.current.abort(), 600000);

        try {
            const res = await fetch('http://13.62.55.241:5000/chatbot/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ msg: input }),
                signal: controllerRef.current.signal
            });
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error('Server response was not OK');
            
            const data = await res.json();
            const botMessage = {
                sender: 'bot',
                text: data.response || 'I encountered an issue processing your request. Please try again.'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [
                ...prev,
                { 
                    sender: 'bot', 
                    text: err.name === 'AbortError' 
                        ? 'The request timed out. Please try again with a more specific question.' 
                        : 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearConversation = () => {
        setMessages([]);
    };

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Box sx={{ 
                maxWidth: '900px', 
                mx: 'auto', 
                p: { xs: 2, md: 3 },
                minHeight: 'calc(100vh - 128px)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 3,
                    gap: 2
                }}>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 'bold',
                        color: indigo[800],
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <SmartToy fontSize="large" /> MediCare AI
                    </Typography>
                    
                    <Tooltip title="Clear conversation" arrow>
                        <IconButton 
                            onClick={clearConversation} 
                            disabled={messages.length === 0}
                            sx={{ 
                                color: grey[600],
                                '&:hover': { color: indigo[600] }
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Paper elevation={3} sx={{ 
                    flex: 1,
                    p: 3, 
                    height: '60vh',
                    overflowY: 'auto', 
                    mb: 3,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: messages.length === 0 ? 'center' : 'flex-start' // Center when empty, start from top when messages exist
                }}>
                    {messages.length === 0 ? (
                        <Fade in={true} timeout={1000}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: grey[600]
                            }}>
                                <AutoFixHigh sx={{ fontSize: 60, mb: 2, color: indigo[200] }} />
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Welcome to MediCare AI
                                </Typography>
                                <Typography variant="body1">
                                    Ask me anything related to autism symptoms, associated conditions, or available treatments.
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Example: "Define "echolalia" and its relevance to ASD?"
                                </Typography>
                            </Box>
                        </Fade>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%'
                        }}>
                            {messages.map((msg, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {msg.sender === 'bot' && (
                                        <Tooltip title="AI Assistant" arrow>
                                            <Avatar sx={{ 
                                                mr: 1, 
                                                bgcolor: blue[500],
                                                boxShadow: 1
                                            }}>
                                                <SmartToy />
                                            </Avatar>
                                        </Tooltip>
                                    )}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: '18px',
                                            maxWidth: { xs: '80%', md: '70%' },
                                            backgroundColor: msg.sender === 'user' 
                                                ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' 
                                                : 'white',
                                            background: msg.sender === 'user'
                                                ? `linear-gradient(135deg, ${blue[50]} 0%, ${blue[100]} 100%)`
                                                : 'white',
                                            color: 'text.primary',
                                            whiteSpace: 'pre-line',
                                            boxShadow: 1,
                                            border: msg.sender === 'user' 
                                                ? `1px solid ${blue[200]}` 
                                                : `1px solid ${grey[200]}`,
                                            position: 'relative',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                [msg.sender === 'user' ? 'right' : 'left']: '-8px',
                                                width: 0,
                                                height: 0,
                                                border: '10px solid transparent',
                                                borderTopColor: msg.sender === 'user' 
                                                    ? blue[100] 
                                                    : 'white',
                                                borderBottom: 0,
                                                borderRight: msg.sender === 'user' ? 0 : '10px solid transparent',
                                                borderLeft: msg.sender === 'user' ? '10px solid transparent' : 0,
                                                marginBottom: '-10px',
                                                [msg.sender === 'user' ? 'marginRight' : 'marginLeft']: '-10px'
                                            }
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                            {msg.text}
                                        </Typography>
                                    </Box>
                                    {msg.sender === 'user' && (
                                        <Tooltip title="You" arrow>
                                            <Avatar sx={{ 
                                                ml: 1, 
                                                bgcolor: green[500],
                                                boxShadow: 1
                                            }}>
                                                <Person />
                                            </Avatar>
                                        </Tooltip>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Paper>

                {/* Input Field - unchanged */}
                <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    <TextField
                        fullWidth
                        label="Type your medical question..."
                        variant="outlined"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleEnter}
                        multiline
                        maxRows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                backgroundColor: 'white',
                                paddingRight: '60px',
                                boxShadow: 1,
                                '& fieldset': {
                                    borderColor: grey[300],
                                },
                                '&:hover fieldset': {
                                    borderColor: blue[300],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: blue[500],
                                    borderWidth: '1px'
                                },
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    sx={{
                                        position: 'absolute',
                                        right: '8px',
                                        color: loading || !input.trim() ? grey[400] : blue[500],
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: blue[700]
                                        }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : <Send />}
                                </IconButton>
                            )
                        }}
                    />
                    
                    <Button
                        variant="contained"
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            minWidth: '120px',
                            borderRadius: '50px',
                            backgroundColor: blue[600],
                            background: `linear-gradient(135deg, ${blue[600]} 0%, ${indigo[600]} 100%)`,
                            '&:hover': { 
                                backgroundColor: blue[700],
                                background: `linear-gradient(135deg, ${blue[700]} 0%, ${indigo[700]} 100%)`,
                                boxShadow: 2
                            },
                            '&:disabled': {
                                background: grey[400]
                            },
                            boxShadow: 1,
                            textTransform: 'none',
                            fontSize: '1rem',
                            padding: '10px 24px'
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask'}
                    </Button>
                </Box>
                
                <Typography variant="caption" sx={{ 
                    mt: 1, 
                    textAlign: 'center', 
                    color: grey[500],
                    fontStyle: 'italic'
                }}>
                    MediCare AI provides general health information only. Always consult a doctor for medical advice.
                </Typography>
            </Box>
            <Footer />
        </>
    );
};

export default Chatbot;
