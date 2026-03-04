import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Divider,
    Container,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8); // Default to 8 for better grid
    const [sort, setSort] = useState('id');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [token, page, limit, sort]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const params = { page, limit, sort };

            const [dataResponses] = await Promise.all([
                Promise.all([
                    axios.get(`${API_URL}/videojuegos`, { ...config, params }),
                    axios.get(`${API_URL}/categorias`),
                    axios.get(`${API_URL}/plataformas`)
                ]),
                new Promise(resolve => setTimeout(resolve, 1000)) // Reduced to 1s
            ]);

            const [v, c, p] = dataResponses;
            setVideojuegos(v.data.data);
            setTotalPages(v.data.totalPages);
            setTotalItems(v.data.totalItems);
            setCategorias(c.data);
            setPlataformas(p.data);

            if (categoriasSeleccionadas.length === 0) {
                setCategoriasSeleccionadas(c.data.map(cat => Number(cat.id)));
            }
            if (plataformasSeleccionadas.length === 0) {
                setPlataformasSeleccionadas(p.data.map(plat => Number(plat.id)));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    // Client-side filtering still exists, but pagination is server-side.
    // This might be tricky if filters reduce the list. 
    // Ideally filters should be server-side too. 
    // For now, I'll keep the UI simple.
    const juegosFiltrados = videojuegos.filter(juego =>
        juego.categorias?.some(id => categoriasSeleccionadas.includes(Number(id))) &&
        juego.plataformas?.some(id => plataformasSeleccionadas.includes(Number(id)))
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setPage(1);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
        setPage(1);
    };

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

            <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                    <MenuCategoria
                        categorias={categorias}
                        categoriasSeleccionadas={categoriasSeleccionadas}
                        onChangeCategoria={(id) => setCategoriasSeleccionadas(prev => prev.includes(Number(id)) ? prev.filter(c => c !== Number(id)) : [...prev, Number(id)])}
                    />
                    <MenuPlataforma
                        plataformas={plataformas}
                        plataformasSeleccionadas={plataformasSeleccionadas}
                        onChangePlataforma={(id) => setPlataformasSeleccionadas(prev => prev.includes(Number(id)) ? prev.filter(p => p !== Number(id)) : [...prev, Number(id)])}
                    />
                </Box>

                <Box sx={{ minWidth: 200, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth size="small" sx={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                    }}>
                        <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Sort By</InputLabel>
                        <Select
                            value={sort}
                            label="Sort By"
                            onChange={handleSortChange}
                            sx={{ color: '#fff' }}
                        >
                            <MenuItem value="id">Latest</MenuItem>
                            <MenuItem value="nombre">Name</MenuItem>
                            <MenuItem value="precio">Price</MenuItem>
                            <MenuItem value="popularity">Popularity</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                    }}>
                        <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Games per Page</InputLabel>
                        <Select
                            value={limit}
                            label="Games per Page"
                            onChange={handleLimitChange}
                            sx={{ color: '#fff' }}
                        >
                            <MenuItem value={4}>4 games</MenuItem>
                            <MenuItem value={8}>8 games</MenuItem>
                            <MenuItem value={12}>12 games</MenuItem>
                            <MenuItem value={16}>16 games</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Divider sx={{ mb: 6, borderColor: 'rgba(255,255,255,0.1)' }} />

            <section>
                <ListarVideojuegos
                    juegos={juegosFiltrados}
                    onClickVideojuego={onClickVideojuego}
                />
            </section>

            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                        '& .MuiPaginationItem-root': { color: '#fff' },
                        '& .Mui-selected': { background: 'rgba(0, 210, 255, 0.2) !important' }
                    }}
                />
            </Box>
        </Box>
    );
};

export default HomePage;
