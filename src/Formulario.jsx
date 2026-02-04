import React, { useState } from "react";


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
      nombre: nombre,
      descripcion: descripcion,
      fechaLanzamiento: fecha,
      compania: compania,
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
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1.5rem" }}>
      <form onSubmit={enviar}>
        <h2>Añadir juego</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre del juego:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength="200"
            required
            rows="3"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
          <small>{descripcion.length}/200</small>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Fecha de lanzamiento:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Compañía:</label>
          <input
            type="text"
            value={compania}
            onChange={(e) => setCompania(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Precio:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>URL de la imagen:</label>
          <input
            type="url"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>URL del video:</label>
          <input
            type="url"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h4>Categorías:</h4>
          {categorias.map((cat) => (
            <div key={cat.id}>
              <label>
                <input
                  type="checkbox"
                  checked={categoriasElegidas.includes(Number(cat.id))}
                  onChange={() => cambiarCategoria(Number(cat.id))}
                />
                {cat.nombre}
              </label>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h4>Plataformas:</h4>
          {plataformas.map((plat) => (
            <div key={plat.id}>
              <label>
                <input
                  type="checkbox"
                  checked={plataformasElegidas.includes(Number(plat.id))}
                  onChange={() => cambiarPlataforma(Number(plat.id))}
                />
                {plat.nombre}
              </label>
            </div>
          ))}
        </div>

        <button type="submit" style={{ padding: "10px 20px", marginRight: "10px" }}>
          Crear juego
        </button>
        <button type="button" onClick={limpiar} style={{ padding: "10px 20px" }}>
          Limpiar
        </button>
      </form>
    </div>
  );
};

export default Formulario;