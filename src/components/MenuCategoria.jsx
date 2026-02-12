import React from "react";
import './Menus.css'

const MenuCategoria = ({ categorias, categoriasSeleccionadas, onChangeCategoria }) => {
  return (
    <div className="menu-container">
      <h2 className="menu-title">
        Categorías
        {categoriasSeleccionadas.length > 0 && (
          <span className="menu-badge">{categoriasSeleccionadas.length}</span>
        )}
      </h2>
      <div className="menu-list">
        {categorias.map((categoria) => {
          const isSelected = categoriasSeleccionadas.includes(Number(categoria.id));
          return (
            <div
              key={categoria.id}
              className={`menu-item ${isSelected ? 'active' : ''}`}
              onClick={() => onChangeCategoria(Number(categoria.id))}
            >
              {categoria.nombre}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuCategoria;
