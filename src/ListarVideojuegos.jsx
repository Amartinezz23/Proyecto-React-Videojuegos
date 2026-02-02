import { useEffect, useState } from "react";
import './ListarVideojuegos.css';

const ListarVideojuegos = () => {

  const [videojuego, setVideojuego] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/videojuegos')
      .then(response => response.json())
      .then(data => setVideojuego(data));
  }, []);

  return (
    <div className="container">
      {videojuego.map((juego) => {
        return (
          <div className="juego-card" key={juego.id}>
            <img
              className="imagen"
              src={juego.urlImagen}
              alt={juego.nombre}
            />
            <h3>{juego.nombre}</h3>
            <p>{juego.descripcion}</p>
            <p>{juego.compañia}</p>
            <p>Precio de salida <strong>{juego.precio}</strong></p>

          </div>
        );
      })}
    </div>
  );
};

export default ListarVideojuegos;
