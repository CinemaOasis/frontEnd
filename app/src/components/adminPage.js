import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import api from '../services/api';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [salaId, setSalaId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cartelera, setCartelera] = useState([]);
  const movieDetailsRef = useRef(null);

  useEffect(() => {
    fetchCartelera();
  }, []);

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
      }
    } catch (error) {
      console.error('Error adding movie to database:', error);
      setErrorMessage('Error adding movie to database');
    }
  };

  const handleAddToCartelera = async () => {
    if (!selectedMovie || !selectedMovie.dbId) {
      setErrorMessage('Please select a movie and add it to the database first');
      return;
    }

    try {
      const requestData = {
        movieId: selectedMovie.dbId,
        salaId: parseInt(salaId, 10),
        startTime,
        status: 'Programada',
      };
      const response = await api.post('/funcion', requestData);
      fetchCartelera(); // Fetch the updated cartelera
    } catch (error) {
      console.error('Error adding function:', error);
      setErrorMessage('Error adding function');
    }
  };

  const handleDeleteFromCartelera = async (funcionId) => {
    try {
      await api.delete(`/funcion/${funcionId}`);
      fetchCartelera(); // Fetch the updated cartelera
    } catch (error) {
      console.error('Error deleting function:', error);
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

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Admin Page</h1>
        </Col>
      </Row>
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
                  {funcion.movieName} - Sala: {funcion.salaId} - Hora: {funcion.startTime} - Estado: {funcion.status}
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
