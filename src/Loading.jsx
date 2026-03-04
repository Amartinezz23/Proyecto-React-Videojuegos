import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: 3
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    thickness={4}
                    sx={{ color: 'rgba(255,255,255,0.1)' }}
                />
                <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    size={80}
                    thickness={4}
                    sx={{
                        color: '#00d2ff',
                        animationDuration: '4s',
                        position: 'absolute',
                        left: 0,
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        },
                    }}
                />
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                Cargando universo gaming...
            </Typography>
        </Box>
    );
};

export default Loading;
