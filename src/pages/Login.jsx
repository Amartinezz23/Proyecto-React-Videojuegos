import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Contexto';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
    
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
    
  const manejador = async (e) => {
    e.preventDefault();
    setError('');
    
    const resultado = await login(username, password);
    
    if (resultado.success) {
      navigate('/'); 
    } else {
      setError(resultado.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/5087/5087607.png" 
          alt="logoUsuario" 
          className="login-logo"
        />
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <form onSubmit={manejador} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <button type="submit" className="login-button">Entrar</button>
          
          {error && <p className="error-message">{error}</p>}
        </form>
        
        <p className="register-link">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;