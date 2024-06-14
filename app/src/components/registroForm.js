import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/Cinema (500 x 200 px).png'; // Asegúrate de que la ruta del logo es correcta
import '../assets/registerStyle.css'; // Asegúrate de que la ruta del archivo CSS es correcta

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await api.post('http://localhost:8888/api/v1/emailauth/register', { name, email, password });
      setMessage(response.data.message);
      navigate('/confirmation');  // Redirige a una página de confirmación
    } catch (error) {
      setError(error.response?.data?.message || 'Fallo en el registro');
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-logo">
          <img src={logo} alt="Cinema Oasis logo" />
        </div>
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Registro</h2>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
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
          <div>
            <label>Confirmar Contraseña:</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Registrarse</button>
          <div className="register-links">
            <p>¿Ya tienes una cuenta? <Link to="/loginForm">Inicia sesión aquí!</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
