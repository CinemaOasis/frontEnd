import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Cartelera from './pages/Cartelera';
import LoginForm from './components/loginForm';
import RegisterForm from './components/registroForm';
import AdminPage from './components/adminPage';
import ConfirmEmail from './components/confirmEmail';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AdminProximamente from './components/adminProximamente';
import AdminEstrenos from './components/adminEstrenos';
import MovieDetails from './components/MovieDetails';
import Estrenos from './pages/Estrenos';
import PaymentPage from './components/PaymentPage';
import Proximamente from './pages/Proximamente';
import SelectFuncion from './components/SelectFuncion'; // Nuevo componente
import api from './services/api';
import { AuthProvider, AuthContext } from './services/authEmail';
import 'bootstrap/dist/css/bootstrap.min.css';

const stripePromise = loadStripe('pk_test_51PSWWOKTvKKZFxxj4GPaec7bKRE5hw7I9S1lVrcSstAKZnI8irlGecs2t29ixBD5JJrFzHEJRt6G6lQfZ29aFINV00SzJ5zJPV'); // Reemplaza con tu clave pública de Stripe

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/emailauth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        const userData = {
          email: response.data.email,
          name: response.data.name,
          roles: response.data.roles.map(role => role.name),
        };
        login(userData);

        if (userData.roles.includes('Admin')) {
          navigate('/adminPage');
        } else {
          navigate('/');
        }
      }).catch(error => {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
      });
    }
  }, [login, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const email = params.get('email');
    const token = params.get('token');

    if (success === 'true' && token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      api.get('/emailauth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        const userData = {
          email: response.data.email,
          name: response.data.name,
          roles: response.data.roles.map(role => role.name),
        };
        login(userData);

        // Actualizar la URL sin parámetros
        navigate('/', { replace: true });

        if (userData.roles.includes('Admin')) {
          navigate('/adminPage');
        } else {
          navigate('/');
        }
      }).catch(error => {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        navigate('/', { replace: true }); // Redirigir a la página principal en caso de error
      });
    } else if (success === 'false') {
      // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje en la UI.
    }
  }, [location, login, navigate]);

  return (
    <Routes>
      <Route path='/' element={<Inicio />} />
      <Route path='/Cartelera' element={<Cartelera />} />
      <Route path='/loginForm' element={<LoginForm />} />
      <Route path='/registroForm' element={<RegisterForm />} />
      <Route path='/adminPage' element={<AdminPage />} />
      <Route path='/adminEstrenos' element={<AdminEstrenos category="Estrenos" />} />
      <Route path='/adminProximamente' element={<AdminProximamente />} />
      <Route path='/confirm' element={<ConfirmEmail />} />
      <Route path='/movie/:id' element={<MovieDetails />} />
      <Route path='/estrenos' element={<Estrenos />} />
      <Route path='/proximamente' element={<Proximamente />} />
      <Route path='/select-funcion/:movieId' element={<SelectFuncion />} /> {/* Nueva ruta */}
      <Route path='/payment/:funcionId' element={<PaymentPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <Main />
        </Router>
      </Elements>
    </AuthProvider>
  );
}

export default App;
