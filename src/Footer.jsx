import { Box, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        padding: 3,
        marginTop: 4,
        backgroundColor: '#0f0c29',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SportsEsportsIcon style={{ marginRight: 8 }} />
        <Typography variant="h6">
          VideoGamesApp
        </Typography>
      </div>

      <Typography variant="body2" style={{ marginTop: 8 }}>
        © {new Date().getFullYear()} Gaming Community Project
      </Typography>
    </Box>
  );
};

export default Footer;