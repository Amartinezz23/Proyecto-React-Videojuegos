import React from "react";
import './Menus.css'

const MenuPlataforma = ({ plataformas, plataformasSeleccionadas, onChangePlataforma }) => {
  return (
    <div className="menu-container">
      <h2 className="menu-title">
        Plataformas
        {plataformasSeleccionadas.length > 0 && (
          <span className="menu-badge">{plataformasSeleccionadas.length}</span>
        )}
      </h2>
      <div className="menu-list">
        {plataformas.map((plataforma) => {
          const isSelected = plataformasSeleccionadas.includes(Number(plataforma.id));
          return (
            <div
              key={plataforma.id}
              className={`menu-item ${isSelected ? 'active' : ''}`}
              onClick={() => onChangePlataforma(Number(plataforma.id))}
            >
              {plataforma.nombre}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuPlataforma;
