import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar el formato del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('El correo electrónico no es válido');
      return;
    }

    try {
      const response = await api.post('http://localhost:8888/api/v1/emailauth/register', { name, email, password });
      setMessage(response.data.message);
      navigate('/confirmation');  // Redirige a una página de confirmación
    } catch (error) {
      if (error.response?.status === 409) {
        setError('El correo electrónico ya está registrado');
      } else {
        setError(error.response?.data?.message || 'Error al registrar');
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div>
        <label>Nombre:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Correo Electrónico:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Confirmar Contraseña:</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
      </div>
      <button type="submit">Registrarse</button>
      <div>
        <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala aquí</a></p>
        <p>¿Ya tienes una cuenta? <a href="/loginForm">Inicia sesión</a></p>
      </div>
    </form>
  );
};

export default RegisterForm;
