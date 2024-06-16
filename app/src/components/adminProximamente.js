// components/AdminProximamente.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import AdminHeader from '../components/adminHeader';
import '../assets/homePageStyle.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';

const AdminProximamente = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [proximamente, setProximamente] = useState([]);
  const [upcomingReleases, setUpcomingReleases] = useState([]);
  const [userName, setUserName] = useState('Admin');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    handleLogin();
    fetchProximamente();
    fetchUpcomingReleases();
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

  const handleSearch = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (searchTerm.trim() === '') {
      setIsSearching(false);
      return;
    }
    try {
      const response = await api.get('/movie/from-movie-api', {
        params: { name: searchTerm },
      });
      setSearchResults(response.data.data);
      setIsSearching(true); // Indicar que se está realizando una búsqueda
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

  const fetchUpcomingReleases = async () => {
    try {
      const response = await api.get('/movie/upcoming');
      setUpcomingReleases(response.data.data);
    } catch (error) {
      console.error('Error fetching upcoming releases:', error);
      toast.error('Error fetching upcoming releases');
    }
  };

  const handleDeleteFromProximamente = async (movieId) => {
    try {
      await api.put(`/movie/${movieId}/proximamente`, { proximamente: false });
      toast.success('Película eliminada de "Próximamente" correctamente');
      fetchProximamente();
    } catch (error) {
      console.error('Error deleting movie from proximamente:', error);
      toast.error('Error eliminando la película de "Próximamente"');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  const formatGenres = (genres) => {
    if (!genres || !Array.isArray(genres)) return 'N/A';
    return genres.map(genre => genre.name).join(', ');
  };

  return (
    <div>
      <AdminHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleSearch={handleSearch} 
        userName={userName} 
        handleKeyPress={handleKeyPress} 
      />
      <Container className="mt-5">
        <ToastContainer />
        <Row>
          <Col>
            <h1>Próximamente</h1>
          </Col>
        </Row>
        <Row className="mt-4">
          {isSearching ? (
            searchResults.length > 0 ? (
              searchResults.map((movie) => (
                <Col key={movie.id} md={6} className="mb-4">
                  <Card className="movie-card">
                    <Row nogutters="true">
                      <Col md={5}>
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
                          <Card.Title>{movie.title}</Card.Title>
                          <Card.Text>
                            Fecha de Estreno: {new Date(movie.release_date).toLocaleDateString()}<br />
                            Género: {formatGenres(movie.genres)}
                          </Card.Text>
                          <div className="d-flex justify-content-between">
                            <Button className="custom-button-add-to-db" onClick={() => handleAddMovieToDatabase(movie)}>Agregar a Base de Datos</Button>
                            <Button className="custom-button-add-to-proximamente" onClick={() => handleAddToProximamente(movie)}>Agregar a Próximamente</Button>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No se encontraron resultados de búsqueda</p>
            )
          ) : (
            upcomingReleases.map((movie) => (
              <Col key={movie.id} md={6} className="mb-4">
                <Card className="movie-card">
                  <Row nogutters="true">
                    <Col md={5}>
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
                        <Card.Title>{movie.title}</Card.Title>
                        <Card.Text>
                          Fecha de Estreno: {new Date(movie.release_date).toLocaleDateString()}<br />
                          Género: {formatGenres(movie.genres)}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button className="custom-button-add-to-db" onClick={() => handleAddMovieToDatabase(movie)}>Agregar a Base de Datos</Button>
                          <Button className="custom-button-add-to-proximamente" onClick={() => handleAddToProximamente(movie)}>Agregar a Próximamente</Button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))
          )}
        </Row>
        <Row className="mt-4">
          <Col>
            <h3>Próximamente</h3>
            {proximamente.length > 0 ? (
              <Row>
                {proximamente.map((movie) => (
                  <Col key={movie.id} md={6} className="mb-4">
                    <Card className="movie-card">
                      <Row nogutters="true">
                        <Col md={5}>
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
                              Género: {(movie.genero || []).join(', ')}
                            </Card.Text>
                            <div className="d-flex justify-content-between">
                              <Button variant="danger" className="ml-3" onClick={() => handleDeleteFromProximamente(movie.id)}>
                                Eliminar
                              </Button>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No hay películas en "Próximamente"</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminProximamente;
