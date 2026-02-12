import { useState, useEffect } from 'react'

import './Home.css'
import ListarVideojuegos from './ListarVideojuegos'
import MenuCategoria from './MenuCategoria'
import Detalle from './DetalleComponente'
import MenuPlataforma from './MenuPlataforma'
import Formulario from './Formulario'
import Footer from './Footer'
import axios from 'axios';


function App() {

  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plataformas, setPlataformas] = useState([]);

  const [juegoClickado, setJuegoClickado] = useState(null);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState([]);


  function clickarJuego(juego) {
    setJuegoClickado(juego);
  }

  function quitarjuegoClickado() {
    let juego = null;
    setJuegoClickado(juego);
  }

  useEffect(() => {
    axios.get('http://localhost:4000/videojuegos')
      .then(response => setVideojuegos(response.data))

  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/categorias')
      .then(response => {
        setCategorias(response.data);
        let IDs = response.data.map(a => Number(a.id));
        setCategoriasSeleccionadas(IDs);
      })

  }, []);



  useEffect(() => {
    axios.get('http://localhost:4000/plataformas')
      .then(response => {
        setPlataformas(response.data)
        let Ids = response.data.map(a => Number(a.id))
        setPlataformasSeleccionadas(Ids);
      })

  }, []);



  function onChangeCategoria(id) {
    if (categoriasSeleccionadas.includes(id)) {
      let arrayNuevo = categoriasSeleccionadas.filter((categoria, indice) => (
        categoria !== id
      ));
      setCategoriasSeleccionadas(arrayNuevo);

    } else {
      let array = [...categoriasSeleccionadas, id];
      setCategoriasSeleccionadas(array);
    }

  }

  function onChangePlataforma(id) {
    if (plataformasSeleccionadas.includes(id)) {
      let arrayNuevo = plataformasSeleccionadas.filter((plataforma, indice) => (
        plataforma !== id
      ));
      setPlataformasSeleccionadas(arrayNuevo);

    } else {
      let array = [...plataformasSeleccionadas, id];
      setPlataformasSeleccionadas(array);
    }

  }

  const onEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/videojuegos/${id}`);
      setVideojuegos(videojuegos.filter(juego => juego.id !== id));
      setJuegoClickado(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const onAgregar = async (juego) => {
    try {
      const response = await axios.post('http://localhost:3000/videojuegos', juego);
      setVideojuegos([...videojuegos, response.data]);
    } catch (error) {
      console.error("Error al agregar juego:", error);
    }
  };

  let juegosFiltradosCategorias = videojuegos.filter(juego =>
    juego.categorias.every(id => categoriasSeleccionadas.includes(id))
  )
  let juegosFiltrados = juegosFiltradosCategorias.filter(juego =>
    juego.plataformas.every(id => plataformasSeleccionadas.includes(id))
  )

  return (
    <div className="app-container">
      <header className="app-header">
        <marquee scrollAmount="15">Videojuegos</marquee>
      </header>

      <section className="top-panel">
        <div className="filters">
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
      </section>

      {juegoClickado && (
        <Detalle
          juego={juegoClickado}
          onCerrar={quitarjuegoClickado}
          onEliminar={onEliminar}
        />
      )}

      <Footer></Footer>
    </div>
  );

}

export default App
