import React from "react";

const MenuPlataforma = ({plataformas, plataformasSeleccionadas, onChangePlataforma})=>{
    return(
        <div style={{marginBottom:"4rem"}}>
            <h2>Plataformas</h2>
            {plataformas.map((plataforma,index)=>{
                return(
                    <div key={plataforma.id}>
                        <label><input type="checkbox" id="cbox1" value="first_checkbox" checked={plataformasSeleccionadas.includes(Number(plataforma.id))} onChange={()=>onChangePlataforma(Number(plataforma.id))}/>{plataforma.nombre} </label>
                    </div>
                    
                )
                
            })}
        </div>
    )
}

export default MenuPlataforma;
