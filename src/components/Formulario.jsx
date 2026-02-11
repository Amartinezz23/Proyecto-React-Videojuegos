import React, { useState } from "react";
import './Formulario.css'
const Formulario = ({ categorias, plataformas, onAgregarJuego }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [compania, setCompania] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [video, setVideo] = useState("");
  const [categoriasElegidas, setCategoriasElegidas] = useState([]);
  const [plataformasElegidas, setPlataformasElegidas] = useState([]);

  function cambiarCategoria(id) {
    if (categoriasElegidas.includes(id)) {
      let nuevas = categoriasElegidas.filter(c => c !== id);
      setCategoriasElegidas(nuevas);
    } else {
      setCategoriasElegidas([...categoriasElegidas, id]);
    }
  }

  function cambiarPlataforma(id) {
    if (plataformasElegidas.includes(id)) {
      let nuevas = plataformasElegidas.filter(p => p !== id);
      setPlataformasElegidas(nuevas);
    } else {
      setPlataformasElegidas([...plataformasElegidas, id]);
    }
  }

  function limpiar() {
    setNombre("");
    setDescripcion("");
    setFecha("");
    setCompania("");
    setPrecio("");
    setImagen("");
    setVideo("");
    setCategoriasElegidas([]);
    setPlataformasElegidas([]);
  }

  function enviar(e) {
    e.preventDefault();

    if (categoriasElegidas.length === 0) {
      alert("Tienes que elegir al menos una categoría");
      return;
    }

    if (plataformasElegidas.length === 0) {
      alert("Tienes que elegir al menos una plataforma");
      return;
    }

    let juegoNuevo = {
      nombre,
      descripcion,
      fechaLanzamiento: fecha,
      compania,
      plataformas: plataformasElegidas,
      categorias: categoriasElegidas,
      precio: Number(precio),
      urlImagen: imagen,
      urlVideo: video
    };

    onAgregarJuego(juegoNuevo);
    limpiar();
  }

  return (
    <div className="formulario-container">
      <form className="formulario-form" onSubmit={enviar}>
        <h2 className="formulario-title">Añadir juego</h2>

        <div className="form-group">
          <label className="form-label">Nombre del juego:</label>
          <input
            type="text"
            className="form-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción:</label>
          <textarea
            className="form-textarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength="200"
            required
            rows="3"
          />
          <small className="form-small">{descripcion.length}/200</small>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de lanzamiento:</label>
          <input
            type="date"
            className="form-input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Compañía:</label>
          <input
            type="text"
            className="form-input"
            value={compania}
            onChange={(e) => setCompania(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Precio:</label>
          <input
            type="number"
            className="form-input"
            step="0.01"
            min="0"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">URL de la imagen:</label>
          <input
            type="url"
            className="form-input"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">URL del video:</label>
          <input
            type="url"
            className="form-input"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <h4 className="form-subtitle">Categorías:</h4>
          <div className="form-checkbox-group">
            {categorias.map((cat) => (
              <div key={cat.id} className="form-checkbox-item">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={categoriasElegidas.includes(Number(cat.id))}
                    onChange={() => cambiarCategoria(Number(cat.id))}
                  />
                  {cat.nombre}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <h4 className="form-subtitle">Plataformas:</h4>
          <div className="form-checkbox-group">
            {plataformas.map((plat) => (
              <div key={plat.id} className="form-checkbox-item">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={plataformasElegidas.includes(Number(plat.id))}
                    onChange={() => cambiarPlataforma(Number(plat.id))}
                  />
                  {plat.nombre}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">Crear juego</button>
          <button type="button" className="btn-clear" onClick={limpiar}>Limpiar</button>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
