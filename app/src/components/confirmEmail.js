import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../services/authEmail';

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const email = params.get('email');
    const name = params.get('name');
    const token = params.get('token');

    if (success === 'true') {
      const userData = { email, name, token };
      login(userData);
      navigate('/', { replace: true });
    } else if (success === 'false') {
      // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje en la UI.
      console.error('Error confirming email');
    }
  }, [location, login, navigate]);

  return (
    <div>
      <p>Procesando confirmación de email...</p>
    </div>
  );
};

export default ConfirmEmail;
