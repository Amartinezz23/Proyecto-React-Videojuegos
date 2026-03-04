import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Fab,
    Paper,
    Typography,
    IconButton,
    TextField,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Fade,
    CircularProgress,
    Stack
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

const AIAssistant = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Gaming Assistant. How can I help you find the perfect game today?", isAi: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/ai/chat`,
                { message: userMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, { text: response.data.response, isAi: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.", isAi: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="ai-assistant"
                onClick={() => setOpen(!open)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                    boxShadow: '0 4px 15px rgba(0, 210, 255, 0.4)',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s'
                    }
                }}
            >
                <SmartToyIcon />
            </Fab>

            <Fade in={open}>
                <Paper
                    elevation={12}
                    sx={{
                        position: 'fixed',
                        bottom: 96,
                        right: 24,
                        width: { xs: 'calc(100% - 48px)', sm: 350 },
                        height: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'rgba(15, 12, 41, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 1300
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        p: 2,
                        background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'white'
                    }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <SmartToyIcon />
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 800 }}>Gaming AI</Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box
                        ref={scrollRef}
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    alignSelf: msg.isAi ? 'flex-start' : 'flex-end',
                                    maxWidth: '85%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1.5,
                                        borderRadius: msg.isAi ? '15px 15px 15px 0' : '15px 15px 0 15px',
                                        background: msg.isAi ? 'rgba(255,255,255,0.05)' : 'rgba(0, 210, 255, 0.2)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        color: 'white'
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                        {loading && (
                            <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: 1, alignItems: 'center' }}>
                                <CircularProgress size={16} />
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Thinking...</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Input */}
                    <Box
                        component="form"
                        onSubmit={handleSend}
                        sx={{
                            p: 2,
                            background: 'rgba(0,0,0,0.2)',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <Stack direction="row" spacing={1}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Ask about a game..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                autoComplete="off"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.05)',
                                        '& fieldset': { borderColor: 'transparent' },
                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
                                    }
                                }}
                            />
                            <IconButton
                                type="submit"
                                color="primary"
                                disabled={!input.trim() || loading}
                                sx={{ background: 'rgba(0, 210, 255, 0.1)', '&:hover': { background: 'rgba(0, 210, 255, 0.2)' } }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Stack>
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default AIAssistant;
