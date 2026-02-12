import { useEffect, useState } from "react";
import './ListarVideojuegos.css';

const ListarVideojuegos = ({ juegos, onClickVideojuego }) => {

  if (!juegos || juegos.length === 0) {
    return (
      <div className="lista-videojuegos">
        <div className="empty-state">
          <p>No se encontraron videojuegos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-videojuegos">
      {juegos.map((juego) => {
        let descripcion = juego.descripcion || "";
        let descripcionRecortada = descripcion.length > 100
          ? descripcion.substring(0, 100) + "..."
          : descripcion;

        return (
          <div onClick={() => onClickVideojuego(juego)} className="videojuego-card" key={juego.id}>
            <div className="card-image-container">
              <img
                className="videojuego-imagen"
                src={juego.urlImagen || "https://via.placeholder.com/300x450?text=No+Image"}
                alt={juego.nombre}
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Error"; }}
              />
            </div>

            <div className="card-content">
              <div>
                <h3 className="videojuego-titulo">{juego.nombre}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {descripcionRecortada}
                </p>
              </div>

              <div className="card-badges">
                <span className="card-badge">{juego.compania || "Indie"}</span>
                {juego.precio !== undefined && (
                  <span className="card-badge price">
                    {Number(juego.precio) === 0 ? "Gratis" : `${juego.precio}€`}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListarVideojuegos;
