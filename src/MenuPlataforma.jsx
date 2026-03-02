import { Box, Typography, Chip, Stack } from "@mui/material";
import DevicesIcon from '@mui/icons-material/Devices';

const MenuPlataforma = ({ plataformas, plataformasSeleccionadas, onChangePlataforma }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
        <DevicesIcon fontSize="small" color="primary" /> Platforms
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        {plataformas.map((plataforma) => {
          const isSelected = plataformasSeleccionadas.includes(Number(plataforma.id));
          return (
            <Chip
              key={plataforma.id}
              label={plataforma.nombre}
              onClick={() => onChangePlataforma(Number(plataforma.id))}
              color={isSelected ? "secondary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              sx={{
                mb: 1,
                borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.2)',
                color: isSelected ? 'white' : 'rgba(255,255,255,0.7)',
                '&:hover': {
                  borderColor: '#3a7bd5',
                }
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default MenuPlataforma;
