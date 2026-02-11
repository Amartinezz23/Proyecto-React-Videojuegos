import React from "react";
import './Footer.css'

const Footer = ()=> {
    
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span className="footer-title">Videojuegos App</span>

        <nav className="footer-links">
          <a href="">Inicio</a>
          <a href="">Videojuegos</a>
          <a href="">Añadir</a>
        </nav>

        <span className="footer-copy">
          © {new Date().getFullYear()} · Proyecto React - Antonio Martínez
        </span>
      </div>
    </footer>
  );
}

export default Footer;
