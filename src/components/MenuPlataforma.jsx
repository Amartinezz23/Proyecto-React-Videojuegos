import React from "react";
import './Menus.css'

const MenuPlataforma = ({ plataformas, plataformasSeleccionadas, onChangePlataforma }) => {
  return (
    <div className="menu-container">
      <h2 className="menu-title">Plataformas</h2>
      <div className="menu-list">
        {plataformas.map((plataforma) => (
          <div key={plataforma.id} className="menu-item">
            <label className="menu-label">
              <input
                type="checkbox"
                className="menu-checkbox"
                checked={plataformasSeleccionadas.includes(Number(plataforma.id))}
                onChange={() => onChangePlataforma(Number(plataforma.id))}
              />
              {plataforma.nombre}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPlataforma;
