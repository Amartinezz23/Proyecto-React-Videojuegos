import React, { useEffect, useState } from "react";
import './ListarVideojuegos.css';

const ListarVideojuegos = ()=>{
    
    const [videojuego, setVideojuego] = useState([]);
    
    useEffect(()=>{
        fetch(`http://localhost:3000/videojuegos`).then(response=> response.json())
        .then(data=>setVideojuego(data))
    },[])
    
    
    return(
        <div id="container"> 
            {videojuego.map((juego, index)=>{
                return(
                    <div >
                        <img id="imagen" src={juego.urlImagen} width={"100rem"} ></img>
                    </div>
                )
            })}
        </div>
    )
}
export default ListarVideojuegos;