import { useEffect, useState } from "react";
import './ListarVideojuegos.css';

const ListarVideojuegos = ({juegos, onClickVideojuego}) => {

  

  return (
    <div className="container">
      {juegos.map((juego) => {
        return (
          <div onClick={()=>onClickVideojuego(juego)} className="juego-card" key={juego.id}>
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
