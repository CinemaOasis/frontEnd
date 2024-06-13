import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import AdminHeader from '../components/adminHeader';  // Ajusta la ruta según sea necesario

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [salaId, setSalaId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [cartelera, setCartelera] = useState([]);
  const [isPremiere, setIsPremiere] = useState(false); // Nueva opción para estreno
  const movieDetailsRef = useRef(null);
  const [userName, setUserName] = useState('Admin');  // Asigna un nombre de usuario por defecto

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

  const handleAddMovieToDatabase = async () => {
    try {
      const response = await api.get('/movie/map-to-db', {
        params: { movieId: selectedMovie.id },
      });
      if (response.data && response.data.data) {
        setSelectedMovie({ ...selectedMovie, dbId: response.data.data.id });
        toast.success('Película agregada a la base de datos correctamente');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const existingMovie = error.response.data.data; // Suponiendo que se devuelve la película existente
        setSelectedMovie({ ...selectedMovie, dbId: existingMovie.id });
        toast.info('Esta película ya está registrada en tu sistema');
      } else {
        console.error('Error adding movie to database:', error);
        toast.error('Error agregando la película a la base de datos');
      }
    }
  };

  const handleAddToCartelera = async () => {
    if (!selectedMovie || !selectedMovie.dbId || !salaId || !startTime) {
      toast.error('Por favor, completa todos los campos antes de agregar la función a la cartelera');
      return;
    }

    try {
      const requestData = {
        movieId: selectedMovie.dbId, // Usando el dbId correcto
        salaId: parseInt(salaId, 10),
        startTime,
        status: 'Programada',
        isPremiere,  // Nueva opción para estreno
      };
      await api.post('/funcion', requestData);
      toast.success('Función agregada a la cartelera correctamente');
      fetchCartelera(); // Fetch the updated cartelera
    } catch (error) {
      console.error('Error adding function:', error);
      if (error.response && error.response.status === 400) {
        toast.error('Revisa las demás funciones, puede que los horarios estén chocando');
      } else {
        toast.error('Error agregando la función');
      }
    }
  };

  const handleDeleteFromCartelera = async (funcionId) => {
    try {
      await api.delete(`/funcion/${funcionId}`);
      toast.success('Función eliminada correctamente');
      fetchCartelera(); // Fetch the updated cartelera
    } catch (error) {
      console.error('Error deleting function:', error);
      toast.error('Error eliminando la función');
    }
  };

  const fetchCartelera = async () => {
    try {
      const response = await api.get('/funcion');
      setCartelera(response.data.data);
    } catch (error) {
      console.error('Error fetching cartelera:', error);
      toast.error('Error fetching cartelera');
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

  const formatTime = (minutes) => {
    const hours24 = Math.floor(minutes / 60);
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const mins = (minutes % 60).toString().padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    return `${hours12}:${mins} ${ampm}`;
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
            <h1>Cartelera</h1>
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
                    <Form.Label>Hora de Inicio</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Check 
                      type="checkbox" 
                      label="Estreno" 
                      checked={isPremiere} 
                      onChange={(e) => setIsPremiere(e.target.checked)} 
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
                    {funcion.movie?.name || 'N/A'} - Sala: {funcion.salaId} - Comienza: {formatTime(funcion.startTime)} - Termina: {formatTime(funcion.endTime)} - Estado: {funcion.status} {funcion.isPremiere ? '- Estreno' : ''}
                    <Button variant="danger" className="ml-3" onClick={() => handleDeleteFromCartelera(funcion.id)}>
                      Eliminar
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No hay funciones disponibles</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPage;
