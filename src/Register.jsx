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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role: 'user' }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(onSwitch, 2000);
            } else {
                setError(data.error || 'Registration failed');
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
                Register
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
                Create a new account to join the community
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
                                    <PersonIcon sx={{ color: 'secondary.main' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: 'secondary.main' }} />
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

                    {success && (
                        <Alert severity="success" variant="filled" sx={{ borderRadius: '12px' }}>
                            {success}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            py: 1.5,
                            background: 'linear-gradient(45deg, #3a7bd5, #00d2ff)',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 14px 0 rgba(58, 123, 213, 0.39)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #3a7bd5, #3a7bd5)',
                                boxShadow: '0 6px 20px rgba(58, 123, 213, 0.5)',
                            }
                        }}
                    >
                        Register
                    </Button>

                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Already have an account?{' '}
                        <Link
                            component="button"
                            type="button"
                            onClick={onSwitch}
                            sx={{ color: 'secondary.main', fontWeight: 600, textDecoration: 'none' }}
                        >
                            Login here
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </Paper>
    );
};

export default Register;
