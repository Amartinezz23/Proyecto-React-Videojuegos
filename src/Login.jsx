import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    Stack,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useAuth } from './AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 5,
                width: '100%',
                maxWidth: '450px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                textAlign: 'center'
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                Login
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
                Enter your credentials to access the platform
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                    <TextField
                        required
                        fullWidth
                        label="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: 'primary.main' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: 'primary.main' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: 'rgba(255,255,255,0.4)' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {error && (
                        <Alert severity="error" variant="filled" sx={{ borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            py: 1.5,
                            background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 14px 0 rgba(0, 210, 255, 0.39)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #00d2ff, #00d2ff)',
                                boxShadow: '0 6px 20px rgba(0, 210, 255, 0.5)',
                            }
                        }}
                    >
                        Login
                    </Button>

                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Don't have an account?{' '}
                        <Link
                            component="button"
                            type="button"
                            onClick={onSwitch}
                            sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
                        >
                            Register here
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </Paper>
    );
};

export default Login;
