import { useEffect, useState } from "react";
import './ListarVideojuegos.css';

const ListarVideojuegos = ({juegos, onClickVideojuego}) => {

  

  return (
    <div className="container">
      {juegos.map((juego) => {
        let descripcion = juego.descripcion;
        let descripcionRecortada = "";
        for (let index = 0; index < 100; index++) {
          descripcionRecortada += descripcion.charAt(index);
          
        };
        
        return (
          <div onClick={()=>onClickVideojuego(juego)} className="juego-card" key={juego.id}>
            <img
              className="imagen"
              src={juego.urlImagen}
              alt={juego.nombre}
            />
            <h3>{juego.nombre}</h3>
            <p>{descripcionRecortada}</p>
            <p>{juego.compañia}</p>
            <p>Precio de salida <strong>{juego.precio}</strong></p>

          </div>
        );
      })}
    </div>
    
  );
};

export default ListarVideojuegos;
