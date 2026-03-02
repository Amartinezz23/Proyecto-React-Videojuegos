import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Divider,
    Container
} from '@mui/material';
import ListarVideojuegos from './ListarVideojuegos';
import MenuCategoria from './MenuCategoria';
import MenuPlataforma from './MenuPlataforma';
import Loading from './Loading';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

const HomePage = ({ onClickVideojuego }) => {
    const { token } = useAuth();
    const [videojuegos, setVideojuegos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [plataformas, setPlataformas] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const [dataResponses] = await Promise.all([
                Promise.all([
                    axios.get(`${API_URL}/videojuegos`, config),
                    axios.get(`${API_URL}/categorias`),
                    axios.get(`${API_URL}/plataformas`)
                ]),
                new Promise(resolve => setTimeout(resolve, 4000)) // Force 4s
            ]);

            const [v, c, p] = dataResponses;
            setVideojuegos(v.data);
            setCategorias(c.data);
            setPlataformas(p.data);
            setCategoriasSeleccionadas(c.data.map(cat => cat.id));
            setPlataformasSeleccionadas(p.data.map(plat => plat.id));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    const juegosFiltrados = videojuegos.filter(juego =>
        juego.categorias?.every(id => categoriasSeleccionadas.includes(Number(id))) &&
        juego.plataformas?.every(id => plataformasSeleccionadas.includes(Number(id)))
    );

    return (
        <Box>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #fff, #00d2ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Gaming Catalog
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
                    Explore the best titles across our vibrant community.
                </Typography>
            </Box>

            <Box sx={{ mb: 6 }}>
                <MenuCategoria
                    categorias={categorias}
                    categoriasSeleccionadas={categoriasSeleccionadas}
                    onChangeCategoria={(id) => setCategoriasSeleccionadas(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])}
                />
                <MenuPlataforma
                    plataformas={plataformas}
                    plataformasSeleccionadas={plataformasSeleccionadas}
                    onChangePlataforma={(id) => setPlataformasSeleccionadas(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])}
                />
            </Box>

            <Divider sx={{ mb: 6, borderColor: 'rgba(255,255,255,0.1)' }} />

            <section>
                <ListarVideojuegos
                    juegos={juegosFiltrados}
                    onClickVideojuego={onClickVideojuego}
                />
            </section>
        </Box>
    );
};

export default HomePage;
