import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginForm from '../src/components/loginForm';
import RegisterForm from '../src/components/registroForm';
import AdminPage from './components/adminPage';
import ConfirmEmail from './components/confirmEmail';
import AdminProximamente from './components/adminProximamente';
import AdminEstrenos from './components/adminEstrenos';
import MovieDetails from './components/MovieDetails';
import Estrenos from './pages/Estrenos'; // Importa el nuevo componente
import { AuthProvider, AuthContext } from './services/authEmail';
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const email = params.get('email');
    const name = params.get('name');

    if (success === 'true') {
      const userData = { email, name };
      login(userData);
      navigate('/', { replace: true });
    } else if (success === 'false') {
      // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje en la UI.
    }
  }, [location, login, navigate]);

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/loginForm' element={<LoginForm />} />
      <Route path='/registroForm' element={<RegisterForm />} />
      <Route path='/adminPage' element={<AdminPage />} />
      <Route path='/adminEstrenos' element={<AdminEstrenos category="Estrenos" />} />
      <Route path='/adminProximamente' element={<AdminProximamente />} />
      <Route path='/confirm' element={<ConfirmEmail />} />
      <Route path='/movie/:id' element={<MovieDetails />} />
      <Route path='/estrenos' element={<Estrenos />} /> {/* Añade la nueva ruta */}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  );
}

export default App;
