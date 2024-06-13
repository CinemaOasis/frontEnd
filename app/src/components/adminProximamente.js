import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import AdminHeader from '../components/adminHeader';

const AdminProximamente = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [proximamente, setProximamente] = useState([]);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    handleLogin();
    fetchProximamente();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post('/emailauth/login', {
        email: 'wanderdj77@gmail.com',
        password: '123456789',
      });
      const { token, name } = response.data.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUserName(name || 'Usuario');
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Error logging in');
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
      toast.error('Error searching movies');
    }
  };

  const handleAddMovieToDatabase = async (movie) => {
    try {
      const response = await api.get('/movie/map-to-db', {
        params: { movieId: movie.id },
      });
      if (response.data && response.data.data) {
        movie.dbId = response.data.data.id;
        toast.success('Película agregada a la base de datos correctamente');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const existingMovie = error.response.data.data;
        movie.dbId = existingMovie.id;
        toast.info('Esta película ya está registrada en tu sistema');
      } else {
        console.error('Error adding movie to database:', error);
        toast.error('Error agregando la película a la base de datos');
      }
    }
  };

  const handleAddToProximamente = async (movie) => {
    if (!movie || !movie.dbId) {
      toast.error('Por favor, selecciona una película y agrégala a la base de datos primero');
      return;
    }

    try {
      await api.put(`/movie/${movie.dbId}/proximamente`, { proximamente: true });
      toast.success('Película agregada a "Próximamente" correctamente');
      fetchProximamente();
    } catch (error) {
      console.error('Error adding to proximamente:', error);
      toast.error('Error agregando la película a "Próximamente"');
    }
  };

  const fetchProximamente = async () => {
    try {
      const response = await api.get('/movie');
      const proximamenteMovies = response.data.data.filter(movie => movie.proximamente);
      setProximamente(proximamenteMovies);
    } catch (error) {
      console.error('Error fetching proximamente:', error);
      toast.error('Error fetching proximamente');
    }
  };

  return (
    <div>
      <AdminHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleSearch={handleSearch} 
        userName={userName} 
      />
      <Container className="mt-5">
        <ToastContainer />
        <Row>
          <Col>
            <h1>Próximamente</h1>
          </Col>
        </Row>
        <Row className="mt-4">
          {searchResults.length > 0 && searchResults.map((movie) => (
            <Col key={movie.id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>{movie.overview}</Card.Text>
                  <Button className="mt-2" onClick={() => handleAddMovieToDatabase(movie)}>
                    Agregar a Base de Datos
                  </Button>
                  <Button className="mt-2" onClick={() => handleAddToProximamente(movie)}>
                    Agregar a Próximamente
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          <Col>
            <h3>Próximamente</h3>
            {proximamente.length > 0 ? (
              <ListGroup>
                {proximamente.map((movie) => (
                  <ListGroup.Item key={movie.id}>
                    {movie.name} - Fecha de Estreno: {new Date(movie.fecha_lanzamiento).toLocaleDateString()} - Duración: {movie.duration} min - Género: {movie.genero.join(', ')}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No upcoming movies available</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminProximamente;
