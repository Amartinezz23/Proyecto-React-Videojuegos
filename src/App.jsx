import { useState, useMemo } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography
} from '@mui/material'
import './App.css'
import { useAuth } from './AuthContext'
import Navbar from './Navbar'
import Login from './Login'
import Register from './Register'
import HomePage from './HomePage'
import MyGamesPage from './MyGamesPage'
import AddGamePage from './AddGamePage'
import DetailPage from './DetailPage'
import Footer from './Footer'

function App() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00d2ff',
      },
      secondary: {
        main: '#3a7bd5',
      },
      background: {
        default: '#0f0c29',
        paper: 'rgba(255, 255, 255, 0.05)',
      },
    },
    typography: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
      },
      h6: {
        fontWeight: 700,
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), []);

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)'
          }}
        >
          <Typography variant="h3" gutterBottom sx={{
            fontWeight: '900',
            background: 'linear-gradient(45deg, #fff, #00d2ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}>
            Video Games Community
          </Typography>
          {showRegister ? (
            <Register onSwitch={() => setShowRegister(false)} />
          ) : (
            <Login onSwitch={() => setShowRegister(true)} />
          )}
        </Box>
      </ThemeProvider>
    );
  }

  const handleGameClick = (juego) => {
    navigate(`/detalle/${juego.id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)'
      }}>
        <Navbar />

        <Container component="main" maxWidth="xl" sx={{ flex: 1, py: 6 }}>
          <Routes>
            <Route path="/" element={<HomePage onClickVideojuego={handleGameClick} />} />
            <Route path="/mis-juegos" element={<MyGamesPage onClickVideojuego={handleGameClick} />} />
            <Route path="/nuevo" element={<AddGamePage />} />
            <Route path="/detalle/:id" element={<DetailPage />} />
          </Routes>
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
