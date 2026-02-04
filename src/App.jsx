import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ListarVideojuegos from './ListarVideojuegos'
import MenuCategoria from './MenuCategoria'
import Detalle from './DetalleComponente'

function App() {
  
  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plataformas, setPlataformas] = useState([]);

  const[juegoClickado, setJuegoClickado] = useState(null);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);


  function clickarJuego (juego){
      setJuegoClickado(juego);
  }

  function quitarjuegoClickado (){
    let juego = null;  
    setJuegoClickado(juego);
  }
  
    useEffect(() => {
      fetch('http://localhost:3000/videojuegos')
        .then(response => response.json())
        .then(data => setVideojuegos(data));
    }, []);

    useEffect(() => {
      fetch('http://localhost:3000/categorias')
        .then(response => response.json())
        .then(data => {setCategorias(data);
          let IDs = data.map(a=> a.id)
          setCategoriasSeleccionadas(IDs);
        });
      
      
      
    }, []);

  

    useEffect(() => {
      fetch('http://localhost:3000/plataformas')
        .then(response => response.json())
        .then(data => setPlataformas(data));
    }, []);


    function onChangeCategoria(id){
      if(categoriasSeleccionadas.includes(id)){
        let arrayNuevo = categoriasSeleccionadas.filter((categoria , indice)=>(
          categoria !== id
        ));
        setCategoriasSeleccionadas(arrayNuevo);
        
      }else{
        let array = [...categoriasSeleccionadas, id];
        setCategoriasSeleccionadas(array);
      }

    }

    let juegosFiltrados = videojuegos.filter(juego=>
      juego.categorias.some(id=>categoriasSeleccionadas.includes(id))
    )

  return (
    <>
      <MenuCategoria categorias={categorias} categoriasSeleccionadas={categoriasSeleccionadas} onChangeCategoria={onChangeCategoria}></MenuCategoria>
      <ListarVideojuegos juegos={juegosFiltrados} onClickVideojuego={clickarJuego}></ListarVideojuegos>
      {juegoClickado && <Detalle juego={juegoClickado } onCerrar={quitarjuegoClickado}> </Detalle>}
      
    </>
  )
}

export default App
