import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ListarVideojuegos from './ListarVideojuegos'
import MenuCategoria from './MenuCategoria'
import Detalle from './DetalleComponente'
import MenuPlataforma from './MenuPlataforma'

function App() {
  
  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plataformas, setPlataformas] = useState([]);

  const[juegoClickado, setJuegoClickado] = useState(null);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState([]);


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
          let IDs = data.map(a=> Number(a.id))
          setCategoriasSeleccionadas(IDs);
        });
      
      
      
    }, []);

  

    useEffect(() => {
      fetch('http://localhost:3000/plataformas')
        .then(response => response.json())
        .then(data => {
          setPlataformas(data);
          let Ids = data.map(p=> Number(p.id));
          setPlataformasSeleccionadas(Ids);
    });
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

    function onChangePlataforma(id){
      if(plataformasSeleccionadas.includes(id)){
        let arrayNuevo = plataformasSeleccionadas.filter((plataforma , indice)=>(
          plataforma !== id
        ));
        setPlataformasSeleccionadas(arrayNuevo);
        
      }else{
        let array = [...plataformasSeleccionadas, id];
        setPlataformasSeleccionadas(array);
      }

    }

    const onEliminar = async (id)=>{
      const response = await fetch(`http://localhost:3000/videojuegos/${id}`,
        {
          method: 'DELETE'
        }
      );

      setVideojuegos(videojuegos.filter(juego=>
        juego.id!=id
      ));
      setJuegoClickado(null);
      
    }

    let juegosFiltradosCategorias = videojuegos.filter(juego=>
      juego.categorias.every(id=>categoriasSeleccionadas.includes(id))
    )
    let juegosFiltrados = juegosFiltradosCategorias.filter(juego=>
      juego.plataformas.every(id=>plataformasSeleccionadas.includes(id))
    )

  return (
    <>
      <MenuCategoria categorias={categorias} categoriasSeleccionadas={categoriasSeleccionadas} onChangeCategoria={onChangeCategoria}></MenuCategoria>
      <MenuPlataforma plataformas={plataformas} plataformasSeleccionadas={plataformasSeleccionadas} onChangePlataforma={onChangePlataforma}></MenuPlataforma>
      <ListarVideojuegos juegos={juegosFiltrados} onClickVideojuego={clickarJuego}></ListarVideojuegos>
      {juegoClickado && <Detalle juego={juegoClickado } onCerrar={quitarjuegoClickado} onEliminar={onEliminar}> </Detalle>}
      
    </>
  )
}

export default App
