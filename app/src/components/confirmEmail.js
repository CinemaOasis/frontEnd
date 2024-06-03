import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import your axios instance

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('tk');

      if (!token) {
        setMessage('No token provided.');
        return;
      }

      try {
        const response = await api.get(`/emailauth/confirm?tk=${token}`);
        if (response.status === 200) {
          setMessage('Email confirmed successfully.');
          // Optionally, you can log the user in automatically
          const loginResponse = await api.post('/login', {
            email: response.data.email,
            token,
          });
          if (loginResponse.status === 200) {
            navigate('/adminPage'); // Redirect to dashboard or any other page
          }
        } else {
          setMessage('Failed to confirm email. Please try again.');
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setMessage('Failed to confirm email. Please try again.');
      }
    };

    confirmEmail();
  }, [location, navigate]);

  return (
    <div>
      <h1>Confirm Email</h1>
      <p>{message}</p>
    </div>
  );
};

export default ConfirmEmail;
