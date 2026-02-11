import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Contexto';
import './Home.css';
import ListarVideojuegos from '../components/ListarVideojuegos';
import MenuCategoria from '../components/MenuCategoria';
import Detalle from '../components/DetalleComponente';
import MenuPlataforma from '../components/MenuPlataforma';
import Formulario from '../components/Formulario';
import Footer from '../components/Footer';
import api from '../services/api';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [juegoClickado, setJuegoClickado] = useState(null);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState([]);
  
  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [verSoloMisJuegos, setVerSoloMisJuegos] = useState(false);

  function clickarJuego(juego) {
    setJuegoClickado(juego);
  }

  function quitarjuegoClickado() {
    setJuegoClickado(null);
  }

  // Cargar videojuegos con paginación
  useEffect(() => {
    const cargarVideojuegos = async () => {
      try {
        const endpoint = verSoloMisJuegos 
          ? `/videojuegos/mis-juegos?page=${paginaActual}&limit=10`
          : `/videojuegos?page=${paginaActual}&limit=10`;
        
        const response = await api.get(endpoint);
        setVideojuegos(response.data.videojuegos || response.data);
        setTotalPaginas(response.data.totalPaginas || 1);
      } catch (error) {
        console.error('Error al cargar videojuegos:', error);
      }
    };
    
    cargarVideojuegos();
  }, [paginaActual, verSoloMisJuegos]);

  // Cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data);
        let IDs = response.data.map(a => Number(a.id));
        setCategoriasSeleccionadas(IDs);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    
    cargarCategorias();
  }, []);

  // Cargar plataformas
  useEffect(() => {
    const cargarPlataformas = async () => {
      try {
        const response = await api.get('/plataformas');
        setPlataformas(response.data);
        let Ids = response.data.map(a => Number(a.id));
        setPlataformasSeleccionadas(Ids);
      } catch (error) {
        console.error('Error al cargar plataformas:', error);
      }
    };
    
    cargarPlataformas();
  }, []);

  function onChangeCategoria(id) {
    if (categoriasSeleccionadas.includes(id)) {
      let arrayNuevo = categoriasSeleccionadas.filter((categoria) => categoria !== id);
      setCategoriasSeleccionadas(arrayNuevo);
    } else {
      let array = [...categoriasSeleccionadas, id];
      setCategoriasSeleccionadas(array);
    }
  }

  function onChangePlataforma(id) {
    if (plataformasSeleccionadas.includes(id)) {
      let arrayNuevo = plataformasSeleccionadas.filter((plataforma) => plataforma !== id);
      setPlataformasSeleccionadas(arrayNuevo);
    } else {
      let array = [...plataformasSeleccionadas, id];
      setPlataformasSeleccionadas(array);
    }
  }

  const onEliminar = async (id) => {
    try {
      await api.delete(`/videojuegos/${id}`);
      setVideojuegos(videojuegos.filter(juego => juego.id !== id));
      setJuegoClickado(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(error.response?.data?.message || 'No tienes permisos para eliminar este juego');
    }
  };

  const onAgregar = async (juego) => {
    try {
      const response = await api.post('/videojuegos', juego);
      setVideojuegos([...videojuegos, response.data]);
      // Recargar la primera página después de agregar
      setPaginaActual(1);
    } catch (error) {
      console.error('Error al agregar juego:', error);
      alert(error.response?.data?.message || 'Error al agregar el juego');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtrar juegos
  let juegosFiltradosCategorias = videojuegos.filter(juego =>
    juego.categorias?.every(id => categoriasSeleccionadas.includes(id))
  );
  let juegosFiltrados = juegosFiltradosCategorias.filter(juego =>
    juego.plataformas?.every(id => plataformasSeleccionadas.includes(id))
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <marquee scrollAmount="15">Videojuegos</marquee>
          <div className="user-info">
            <span>Bienvenido, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <section className="top-panel">
        <div className="filters">
          <div className="filter-toggle">
            <button 
              className={!verSoloMisJuegos ? 'active' : ''}
              onClick={() => {
                setVerSoloMisJuegos(false);
                setPaginaActual(1);
              }}
            >
              Todos los juegos
            </button>
            <button 
              className={verSoloMisJuegos ? 'active' : ''}
              onClick={() => {
                setVerSoloMisJuegos(true);
                setPaginaActual(1);
              }}
            >
              Mis juegos
            </button>
          </div>
          
          <MenuCategoria
            categorias={categorias}
            categoriasSeleccionadas={categoriasSeleccionadas}
            onChangeCategoria={onChangeCategoria}
          />
          <MenuPlataforma
            plataformas={plataformas}
            plataformasSeleccionadas={plataformasSeleccionadas}
            onChangePlataforma={onChangePlataforma}
          />
        </div>

        <div className="form-panel">
          <Formulario
            categorias={categorias}
            plataformas={plataformas}
            onAgregarJuego={onAgregar}
          />
        </div>
      </section>

      <section className="games-section">
        <ListarVideojuegos
          juegos={juegosFiltrados}
          onClickVideojuego={clickarJuego}
        />
        
        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button 
              onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>

      {juegoClickado && (
        <Detalle
          juego={juegoClickado}
          onCerrar={quitarjuegoClickado}
          onEliminar={onEliminar}
          esPropio={juegoClickado.userId === user?.id || user?.role === 'admin'}
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;