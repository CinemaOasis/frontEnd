import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import api from '../services/api';
import UserHeader from '../components/usuarioHeader';
import Header from '../components/header';
import { AuthContext } from '../services/authEmail';
import WelcomeScreen from '../components/WelcomeScreen';
import { useNavigate } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails'; // Asegúrate de que la ruta es correcta
import '../assets/homePageStyle.css';

const HomePage = () => {
  const [cartelera, setCartelera] = useState([]);
  const [groupedCartelera, setGroupedCartelera] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartelera();
  }, []);

  const fetchCartelera = async () => {
    try {
      const response = await api.get('/funcion');
      const funciones = response.data.data;
      setCartelera(funciones);
      groupCartelera(funciones);
    } catch (error) {
      console.error('Error fetching cartelera:', error);
    }
  };

  const groupCartelera = (funciones) => {
    const grouped = funciones.reduce((acc, funcion) => {
      const key = `${funcion.movie.id}-${funcion.isWeekend}`;
      if (!acc[key]) {
        acc[key] = { movie: funcion.movie, funciones: [] };
      }
      acc[key].funciones.push(funcion);
      return acc;
    }, {});

    setGroupedCartelera(Object.values(grouped));
  };

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handleViewMore = (movieId) => {
    setSelectedMovieId(movieId);
    setShowModal(true);
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
          {groupedCartelera.length > 0 ? (
            groupedCartelera.map((group) => (
              <Col key={group.movie.id + (group.funciones[0].isWeekend ? '-weekend' : '')} md={6} className="mb-4">
                <Card className="movie-card">
                  <Row noGutters>
                    <Col md={5} className="d-flex align-items-center justify-content-center">
                      <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${group.movie.poster_path}`} className="movie-poster" />
                    </Col>
                    <Col md={7}>
                      <Card.Body>
                        <Card.Title>{group.movie.name}</Card.Title>
                        <Card.Text>
                          {group.funciones.map((funcion, index) => (
                            <div key={index}>
                              Sala: {funcion.salaId} {funcion.isWeekend ? 'Sábados y Domingos' : 'Todos los días'}<br />
                              Horario: {formatTime(funcion.startTime)}<br />
                            </div>
                          ))}
                          {group.funciones.some(funcion => funcion.isPremiere) && <Badge bg="warning" text="dark">Estreno</Badge>}
                          {group.funciones.some(funcion => funcion.isWeekend) && <Badge bg="info" text="dark">Fin de Semana</Badge>}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button className="custom-button-view-more" onClick={() => handleViewMore(group.movie.id)}>Ver Más</Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Película</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMovieId && <MovieDetails id={selectedMovieId} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HomePage;
