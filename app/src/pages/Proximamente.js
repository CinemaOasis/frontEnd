import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import api from '../services/api';
import UserHeader from '../components/usuarioHeader';
import Header from '../components/header';
import Footer from "../components/Footer";
import ScrollToTopButton from '../components/ScrollToTopButton';
import { AuthContext } from '../services/authEmail';
import WelcomeScreen from '../components/WelcomeScreen';
import { useNavigate } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails';
import { BsFillCameraVideoFill } from 'react-icons/bs'; // Importación correcta
import '../assets/homePageStyle.css';

const Proximamente = () => {
  const [proximamente, setProximamente] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProximamente();
  }, []);

  const fetchProximamente = async () => {
    try {
      const response = await api.get('/movie');
      const proximamenteMovies = response.data.data.filter(movie => movie.proximamente);
      setProximamente(proximamenteMovies);
    } catch (error) {
      console.error('Error fetching proximamente:', error);
    }
  };

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handleViewMore = (movieId) => {
    if (isAuthenticated){
      setSelectedMovieId(movieId);
      setShowModal(true);
    }
    else {
      navigate('/loginForm');
    }
    
  };

  const formatTime = (minutes) => {
    const hours24 = Math.floor(minutes / 60);
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const mins = (minutes % 60).toString().padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    return `${hours12}:${mins} ${ampm}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  };

  const formatGenres = (genres) => {
    if (!genres || !Array.isArray(genres)) return 'N/A';
    return genres.join(', ');
  };

  if (showWelcome && isAuthenticated && user) {
    return <WelcomeScreen name={user.name || (user.email && user.email.split('@')[0])} onContinue={handleContinue} />;
  }

  return (
    <div>
      {isAuthenticated && user ? (
        <UserHeader searchTerm={''} setSearchTerm={() => {}} handleSearch={() => {}} userName={user.name || (user.email && user.email.split('@')[0])} />
      ) : (
        <Header />
      )}
      <Container className="mt-5">
        <Row>
          {proximamente.length > 0 ? (
            proximamente.map((movie) => (
              <Col key={movie.id} md={6} className="mb-4">
                <Card className="movie-card">
                  <Row noGutters>
                    <Col md={5} className="d-flex align-items-center justify-content-center">
                      {movie.poster_path ? (
                        <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="movie-poster" />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <BsFillCameraVideoFill size={96} />
                        </div>
                      )}
                    </Col>
                    <Col md={7}>
                      <Card.Body>
                        <Card.Title>{movie.name}</Card.Title>
                        <Card.Text>
                          Fecha de Estreno: {new Date(movie.fecha_lanzamiento).toLocaleDateString()}<br />
                          Duración: {formatDuration(movie.duration)}<br />
                          Género: {formatGenres(movie.genero)}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button className="custom-button-view-more" onClick={() => handleViewMore(movie.id)}>Ver Más</Button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay películas en "Próximamente"</p>
          )}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Película</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMovieId && <MovieDetails id={selectedMovieId} />}
        </Modal.Body>
      </Modal>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default Proximamente;
