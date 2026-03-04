import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Chip,
  Box
} from '@mui/material';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const ListarVideojuegos = ({ juegos, onClickVideojuego }) => {
  return (
    <Grid container spacing={4} sx={{ mt: 2 }}>
      {juegos.map((juego) => (
        <Grid item key={juego.id} xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 12px 40px rgba(0, 210, 255, 0.3)',
                borderColor: 'rgba(0, 210, 255, 0.5)'
              }
            }}
          >
            <CardActionArea onClick={() => onClickVideojuego(juego)}>
              <CardMedia
                component="img"
                height="200"
                image={juego.urlImagen}
                alt={juego.nombre}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    lineHeight: 1.2
                  }}>
                    {juego.nombre}
                  </Typography>
                  <Typography variant="h6" color="#00d2ff" sx={{ fontWeight: 'bold' }}>
                    {juego.precio}€
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  {juego.compania}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4caf50' }}>
                    <ThumbUpIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{juego.likes || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#f44336' }}>
                    <ThumbDownIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{juego.dislikes || 0}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {juego.isGeneric && (
                    <Chip
                      label="Generic"
                      size="small"
                      icon={<VideogameAssetIcon />}
                      sx={{ background: 'rgba(58, 123, 213, 0.2)', color: '#3a7bd5', borderColor: '#3a7bd5' }}
                      variant="outlined"
                    />
                  )}
                  <Chip
                    label={juego.user?.username || 'System'}
                    size="small"
                    sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}
                  />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListarVideojuegos;
