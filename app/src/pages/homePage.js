import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import MovieCarousel from '../components/movieCarrusel'; // Asegúrate de que la ruta es correcta
import UserHeader from '../components/usuarioHeader'; // Asegúrate de que la ruta es correcta
import Header from '../components/header'; // Asegúrate de que la ruta es correcta
import { AuthContext } from '../services/authEmail'; // Asegúrate de que AuthContext se importe correctamente
import WelcomeScreen from '../components/WelcomeScreen'; // Asegúrate de que la ruta es correcta
import '../assets/movieCarrusel.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    api.get('http://localhost:8888/api/v1/movie')
      .then(response => {
        setMovies(response.data.data); // Ajusta según la estructura de tu respuesta
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  return (
    <div>
      {showWelcome && isAuthenticated && user ? (
        <WelcomeScreen name={user.name || (user.email && user.email.split('@')[0])} onContinue={handleContinue} />
      ) : (
        <>
          {isAuthenticated && user ? (
            <UserHeader searchTerm={''} setSearchTerm={() => {}} handleSearch={() => {}} userName={user.name || (user.email && user.email.split('@')[0])} />
          ) : (
            <Header /> // Cambiar al encabezado normal cuando no está autenticado
          )}
          {isAuthenticated && user ? (
            <div>
            </div>
          ) : (
            <div>
            </div>
          )}
          <MovieCarousel movies={movies} />
          {/* Otros componentes como Footer, etc. */}
        </>
      )}
    </div>
  );
};

export default HomePage;
