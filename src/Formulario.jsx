import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormHelperText,
  Paper,
  Typography,
  Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const Formulario = ({ categorias, plataformas, onAgregarJuego }) => {
  const [nombre, setNombre] = useState("");
  const [compania, setCompania] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !compania || !precio || !urlImagen) {
      alert("Please fill in the required fields");
      return;
    }

    onAgregarJuego({
      nombre,
      compania,
      precio: parseFloat(precio),
      descripcion,
      urlImagen,
      categorias: categoriasSeleccionadas,
      plataformas: plataformasSeleccionadas,
    });

    // Reset form
    setNombre("");
    setCompania("");
    setPrecio("");
    setDescripcion("");
    setUrlImagen("");
    setCategoriasSeleccionadas([]);
    setPlataformasSeleccionadas([]);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px'
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            label="Game Name"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#00d2ff' } } }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <TextField
              required
              fullWidth
              label="Company"
              value={compania}
              onChange={(e) => setCompania(e.target.value)}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              inputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#00d2ff' } } }}
            />
            <TextField
              required
              fullWidth
              type="number"
              label="Price (€)"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              inputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#00d2ff' } } }}
            />
          </Stack>

          <TextField
            required
            fullWidth
            label="Image URL"
            value={urlImagen}
            onChange={(e) => setUrlImagen(e.target.value)}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#00d2ff' } } }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#00d2ff' } } }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Categories</InputLabel>
              <Select
                multiple
                value={categoriasSeleccionadas}
                onChange={(e) => setCategoriasSeleccionadas(e.target.value)}
                input={<OutlinedInput label="Categories" />}
                sx={{ color: 'white' }}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Platforms</InputLabel>
              <Select
                multiple
                value={plataformasSeleccionadas}
                onChange={(e) => setPlataformasSeleccionadas(e.target.value)}
                input={<OutlinedInput label="Platforms" />}
                sx={{ color: 'white' }}
              >
                {plataformas.map((plat) => (
                  <MenuItem key={plat.id} value={plat.id}>
                    {plat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
              fontWeight: 'bold',
              borderRadius: '12px'
            }}
          >
            Add Video Game
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Formulario;
