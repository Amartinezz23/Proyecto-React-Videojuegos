import { Box, Typography, Link, Container, Stack } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        background: 'rgba(15, 12, 41, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <SportsEsportsIcon sx={{ color: '#00d2ff' }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
              VideoGamesApp
            </Typography>
          </Stack>

          <Typography variant="body2" color="rgba(255,255,255,0.5)" align="center">
            © {new Date().getFullYear()} Gaming Community Project. Built with Material UI & React.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
