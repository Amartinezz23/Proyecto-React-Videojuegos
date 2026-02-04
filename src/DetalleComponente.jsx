import React from "react";
import "./Detalle.css";

const Detalle = ({juego, onCerrar}) => {
    return(
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onCerrar}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                <div className="modal-content">
                    <div className="modal-image-container">
                        <img 
                            src={juego.urlImagen} 
                            alt={juego.nombre}
                            className="modal-image"
                        />
                        <div className="modal-image-overlay"></div>
                    </div>

                    <div className="modal-body">
                        <div className="modal-header">
                            <h1 className="modal-title">{juego.nombre}</h1>
                            <div className="modal-price">
                                <span className="price-label">Precio</span>
                                <span className="price-value">${juego.precio}</span>
                            </div>
                        </div>

                        <div className="modal-description">
                            <h3>Descripción</h3>
                            <p>{juego.descripcion}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detalle;