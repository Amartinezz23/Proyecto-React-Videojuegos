import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Contexto";

const ProtegerRuta = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Si NO hay usuario logueado → redirige al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si hay usuario → deja pasar
  return children;
};

export default ProtegerRuta;
