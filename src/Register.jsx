import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const Register = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                setSuccess('Registration successful!');
                setTimeout(onSwitch, 2000);
            } else {
                setError(data.error || 'Registration failed');
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
                Register
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

                {success && (
                    <Typography color="primary" variant="body2">
                        {success}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Register
                </Button>
            </form>

            <Typography variant="body2" sx={{ marginTop: 2 }}>
                Already have an account?{' '}
                <span
                    onClick={onSwitch}
                    style={{ color: 'blue', cursor: 'pointer' }}
                >
                    Login here
                </span>
            </Typography>
        </Box>
    );
};

export default Register;