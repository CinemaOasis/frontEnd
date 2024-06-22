import React, { useState } from 'react';
import api from '../services/api';
import '../assets/ForgotPasswordForm.css'; // Asegúrate de que la ruta del archivo CSS es correcta

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/emailauth/reset-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al solicitar la recuperación de la contraseña');
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleForgotPassword}>
        <h2>Recuperar Contraseña</h2>
        {message && <p className="success-message">{message}</p>}
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
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
