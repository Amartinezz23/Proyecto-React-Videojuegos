import React from "react";
import './Menus.css'

const MenuCategoria = ({ categorias, categoriasSeleccionadas, onChangeCategoria }) => {
  return (
    <div className="menu-container">
      <h2 className="menu-title">Categorías</h2>
      <div className="menu-list">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="menu-item">
            <label className="menu-label">
              <input
                type="checkbox"
                className="menu-checkbox"
                checked={categoriasSeleccionadas.includes(Number(categoria.id))}
                onChange={() => onChangeCategoria(Number(categoria.id))}
              />
              {categoria.nombre}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategoria;
