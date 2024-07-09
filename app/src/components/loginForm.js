import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import { AuthContext } from '../services/authEmail';
import logo from '../assets/Cinema (500 x 200 px).png'; // Asegúrate de que la ruta del logo es correcta
import '../assets/loginStyle.css'; // Asegúrate de que la ruta del archivo CSS es correcta

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Email y contraseña son requeridos');
      return;
    }
    try {
      const response = await api.post('http://localhost:8888/api/v1/emailauth/login', { email, password });
      const userData = response.data.data; // Accede al objeto data dentro de la respuesta
      const token = userData.token;
      console.log('Token:', token); // Log para verificar el token
      console.log('User Data:', userData); // Verificar el objeto completo

      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', token);

      // Llamar a la función login del contexto de autenticación
      login(userData);

      // Verificar el rol del usuario
      const roles = userData.roles.map(role => role.name);
      if (roles.includes('Admin')) {
        navigate('/adminPage');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError('Solicitud incorrecta. El correo o la contraseña son incorrecto.');
            break;
          case 401:
            setError('Correo electrónico o contraseña incorrectos');
            break;
          case 404:
            setError('Correo electrónico no encontrado');
            break;
          default:
            setError(error.response.data.message || 'Error al iniciar sesión');
        }
      } else {
        setError('Error al iniciar sesión');
      }
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo">
          <img src={logo} alt="Cinema Oasis logo" />
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          {error && <p className="error-message">{error}</p>}
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="Introduce tu email"
            />
          </div>
          <div className="password-container">
            <label>Contraseña:</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"} // Cambiar tipo de entrada basado en showPassword
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="Introduce tu contraseña"
              />
              <span onClick={toggleShowPassword} className="password-toggle-icon">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <button type="submit">Acceder</button>
          <div className="login-links">
            <p><Link to="/forgot-password">Olvidé mi contraseña</Link></p>
            <p>¿Aún no tienes una cuenta? <Link to="/registroForm">Regístrate aquí!</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
