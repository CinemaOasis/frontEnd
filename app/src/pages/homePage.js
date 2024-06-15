import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import api from '../services/api';
import UserHeader from '../components/usuarioHeader';
import Header from '../components/header';
import { AuthContext } from '../services/authEmail';
import WelcomeScreen from '../components/WelcomeScreen';
import { useNavigate } from 'react-router-dom';
import '../assets/homePageStyle.css';

const HomePage = () => {
  const [cartelera, setCartelera] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartelera();
  }, []);

  const fetchCartelera = async () => {
    try {
      const response = await api.get('/funcion');
      setCartelera(response.data.data); // Ajusta según la estructura de tu respuesta
    } catch (error) {
      console.error('Error fetching cartelera:', error);
    }
  };

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handleViewMore = (movieId) => {
    if (isAuthenticated) {
      navigate(`/movie/${movieId}`);
    } else {
      navigate('/loginForm');
    }
  };

  const handleBuyTickets = () => {
    if (isAuthenticated) {
      // Lógica para comprar boletos
    } else {
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

  // Evitamos renderizar la HomePage mientras se muestra la pantalla de bienvenida
  if (showWelcome && isAuthenticated && user) {
    return <WelcomeScreen name={user.name || (user.email && user.email.split('@')[0])} onContinue={handleContinue} />;
  }

  return (
    <div>
      {isAuthenticated && user ? (
        <UserHeader searchTerm={''} setSearchTerm={() => {}} handleSearch={() => {}} userName={user.name || (user.email && user.email.split('@')[0])} />
      ) : (
        <Header /> // Cambiar al encabezado normal cuando no está autenticado
      )}
      <Container className="mt-5">
        <Row>
          {cartelera.length > 0 ? (
            cartelera.map((funcion) => (
              <Col key={funcion.id} md={6} className="mb-4">
                <Card className="movie-card">
                  <Row noGutters>
                    <Col md={5}>
                      <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${funcion.movie.poster_path}`} />
                    </Col>
                    <Col md={7}>
                      <Card.Body>
                        <Card.Title>{funcion.movie.name}</Card.Title>
                        <Card.Text>
                          Sala: {funcion.salaId}<br />
                          Horario: {formatTime(funcion.startTime)}<br />
                          {funcion.isPremiere && <Badge bg="warning" text="dark">Estreno</Badge>}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button className="custom-button-view-more" onClick={() => handleViewMore(funcion.movie.id)}>Ver Más</Button>
                          <Button className="custom-button-buy-tickets" onClick={handleBuyTickets}>Comprar Boletos</Button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay funciones disponibles</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
