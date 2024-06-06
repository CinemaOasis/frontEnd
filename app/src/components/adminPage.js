import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup, Alert } from 'react-bootstrap';
import api from '../services/api';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [salaId, setSalaId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cartelera, setCartelera] = useState([]);
  const movieDetailsRef = useRef(null);

  useEffect(() => {
    handleLogin();
    fetchCartelera();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post('/emailauth/login', {
        email: 'wanderdj77@gmail.com',
        password: '123456789',
      });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get('/movie/from-movie-api', {
        params: { name: searchTerm },
      });
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const handleAddMovieToDatabase = async () => {
    try {
      const response = await api.get('/movie/map-to-db', {
        params: { movieId: selectedMovie.id },
      });
      if (response.data && response.data.data) {
        setSelectedMovie({ ...selectedMovie, dbId: response.data.data.id });
        setSuccessMessage('Película agregada a la base de datos correctamente');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const existingMovie = error.response.data.data; // Aquí debería devolver el movieId existente
        setSelectedMovie({ ...selectedMovie, dbId: existingMovie.id });
        setSuccessMessage('Esta película ya está registrada en tu sistema');
      } else {
        console.error('Error adding movie to database:', error);
        setErrorMessage('Error agregando la película a la base de datos');
      }
    }
  };

  const handleAddToCartelera = async () => {
    if (!selectedMovie || !selectedMovie.dbId) {
      setErrorMessage('Por favor, selecciona una película y agrégala a la base de datos primero');
      return;
    }

    try {
      const requestData = {
        movieId: selectedMovie.dbId, // Usando el dbId correcto
        salaId: parseInt(salaId, 10),
        startTime,
        status: 'Programada',
      };
      await api.post('/funcion', requestData);
      setSuccessMessage('Función agregada a la cartelera correctamente');
      fetchCartelera(); // Fetch the updated cartelera
    } catch (error) {
      console.error('Error adding function:', error);
      setErrorMessage('Error agregando la función');
    }
  };

  const handleDeleteFromCartelera = async (funcionId) => {
    try {
      await api.delete(`/funcion/${funcionId}`);
      setSuccessMessage('Función eliminada correctamente');
      fetchCartelera(); // Fetch the updated cartelera
    } catch (error) {
      console.error('Error deleting function:', error);
      setErrorMessage('Error eliminando la función');
    }
  };

  const fetchCartelera = async () => {
    try {
      const response = await api.get('/funcion');
      setCartelera(response.data.data);
    } catch (error) {
      console.error('Error fetching cartelera:', error);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    if (movieDetailsRef.current) {
      movieDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (selectedMovie && movieDetailsRef.current) {
      movieDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMovie]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Admin Page</h1>
        </Col>
      </Row>
      {errorMessage && (
        <Row>
          <Col>
            <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
              {errorMessage}
            </Alert>
          </Col>
        </Row>
      )}
      {successMessage && (
        <Row>
          <Col>
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          </Col>
        </Row>
      )}
      <Row className="mt-4">
        <Col md={8}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Button className="mt-2" onClick={handleSearch}>
            Search
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        {searchResults.length > 0 && searchResults.map((movie) => (
          <Col key={movie.id} md={4} className="mb-4">
            <Card onClick={() => handleMovieSelect(movie)}>
              <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedMovie && (
        <Row className="mt-4" ref={movieDetailsRef}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{selectedMovie.title}</Card.Title>
                <Card.Text>{selectedMovie.overview}</Card.Text>
                <Button className="mt-2" onClick={handleAddMovieToDatabase}>
                  Agregar a Base de Datos
                </Button>
                <Form.Group className="mt-3">
                  <Form.Label>Sala ID</Form.Label>
                  <Form.Control
                    type="number"
                    value={salaId}
                    onChange={(e) => setSalaId(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>
                <Button className="mt-2" onClick={handleAddToCartelera}>
                  Crear Cartelera
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <Row className="mt-4">
        <Col>
          <h3>Cartelera</h3>
          {cartelera.length > 0 ? (
            <ListGroup>
              {cartelera.map((funcion) => (
                <ListGroup.Item key={funcion.id}>
                  {funcion.movie?.name || 'N/A'} - Sala: {funcion.salaId} - Hora: {funcion.startTime} - Estado: {funcion.status}
                  <Button variant="danger" className="ml-3" onClick={() => handleDeleteFromCartelera(funcion.id)}>
                    Eliminar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No functions available</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
