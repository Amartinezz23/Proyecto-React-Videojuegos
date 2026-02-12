import React, { useEffect } from "react";
import "./Detalle.css";

const Detalle = ({ juego, onCerrar, onEliminar, esPropio }) => {

    // Disable body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!juego) return null;

    return (
        <div className="detalle-overlay" onClick={onCerrar}>
            <div className="detalle-container" onClick={(e) => e.stopPropagation()}>
                <button className="btn-cerrar" onClick={onCerrar}>
                    &times;
                </button>

                <div className="detalle-media">
                    {juego.urlVideo ? (
                        <video
                            className="detalle-video"
                            src={juego.urlVideo}
                            controls
                            autoPlay
                            muted
                            loop
                            poster={juego.urlImagen}
                        >
                            Tu navegador no soporta video.
                        </video>
                    ) : (
                        <img
                            src={juego.urlImagen}
                            alt={juego.nombre}
                            className="detalle-img"
                        />
                    )}
                </div>

                <div className="detalle-info">
                    <div>
                        <h1 className="detalle-titulo">{juego.nombre}</h1>
                        <div className="detalle-meta" style={{ marginTop: '15px' }}>
                            <div className="detalle-chip">
                                <span>🏢</span> {juego.compania}
                            </div>
                            <div className="detalle-chip">
                                <span>📅</span> {juego.fechaLanzamiento}
                            </div>
                            {juego.username && (
                                <div className="detalle-chip">
                                    <span>👤</span> Subido por: {juego.username}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="detalle-descripcion">
                        {juego.descripcion}
                    </div>

                    <div className="detalle-precio">
                        {Number(juego.precio) === 0 ? "FREE" : `${juego.precio}€`}
                    </div>

                    {esPropio && (
                        <div className="detalle-actions">
                            <button className="btn-eliminar" onClick={() => onEliminar(juego.id)}>
                                Eliminar Videojuego
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Detalle;