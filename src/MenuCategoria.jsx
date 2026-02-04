import React from "react";

const MenuCategoria = ({categorias, categoriasSeleccionadas, onChangeCategoria})=>{
    return(
        <div style={{marginBottom:"4rem"}}>
            <h2>Categorias</h2>
            {categorias.map((categoria,index)=>{
                return(
                    <div key={categoria.id}>
                        <label><input type="checkbox" id="cbox1" value="first_checkbox" checked={categoriasSeleccionadas.includes(Number(categoria.id))} onChange={()=>onChangeCategoria(Number(categoria.id))}/>{categoria.nombre} </label>
                    </div>
                    
                )
                
            })}
        </div>
    )
}

export default MenuCategoria;
