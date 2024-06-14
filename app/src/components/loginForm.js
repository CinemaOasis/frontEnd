import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../services/authEmail'; // Asegúrate de que la ruta es correcta

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Utiliza el contexto de autenticación

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Email y contraseña son requeridos');
      return;
    }
    try {
      const response = await api.post('http://localhost:8888/api/v1/emailauth/login', { email, password });
      localStorage.setItem('token', response.data.token);

      const userData = {
        email: response.data.email,
        name: response.data.name,
        role: response.data.email === 'wanderdj77@gmail.com' ? 'admin' : 'user'
      };
      login(userData); // Actualiza el contexto con los datos del usuario

      if (userData.role === 'admin') {
        navigate('/adminPage');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('El correo electrónico o la contraseña son incorrectos.');
        } else if (error.response.status === 401 || error.response.status === 403) {
          setError('Correo electrónico o contraseña incorrectos');
        } else {
          setError(error.response.data.message || 'Error al iniciar sesión');
        }
      } else {
        setError('Error al iniciar sesión');
      }
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div className="login-links">
        <p><Link to="/forgot-password">Olvidé mi contraseña</Link></p>
        <p>¿Aún no tienes una cuenta? <Link to="/registroForm">Regístrate</Link></p>
      </div>
    </div>
  );
};

export default LoginForm;
