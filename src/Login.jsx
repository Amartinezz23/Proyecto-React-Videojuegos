import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useAuth } from './AuthContext';

const Login = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        <Box
            sx={{
                padding: 3,
                maxWidth: 400,
                margin: '0 auto',
                textAlign: 'center',
            }}
        >
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Login
                </Button>
            </form>

            <Typography variant="body2" sx={{ marginTop: 2 }}>
                Don't have an account?{' '}
                <span
                    onClick={onSwitch}
                    style={{ color: 'blue', cursor: 'pointer' }}
                >
                    Register here
                </span>
            </Typography>
        </Box>
    );
};

export default Login;