import { Box, Typography, Chip, Stack } from "@mui/material";
import CategoryIcon from '@mui/icons-material/Category';

const MenuCategoria = ({ categorias, categoriasSeleccionadas, onChangeCategoria }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
        <CategoryIcon fontSize="small" color="primary" /> Categories
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        {categorias.map((categoria) => {
          const isSelected = categoriasSeleccionadas.includes(Number(categoria.id));
          return (
            <Chip
              key={categoria.id}
              label={categoria.nombre}
              onClick={() => onChangeCategoria(Number(categoria.id))}
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              sx={{
                mb: 1,
                borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.2)',
                color: isSelected ? 'white' : 'rgba(255,255,255,0.7)',
                '&:hover': {
                  borderColor: '#00d2ff',
                }
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default MenuCategoria;
