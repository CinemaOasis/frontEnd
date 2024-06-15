import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import api from '../services/api';
import '../assets/movieDetailsStyle.css'; // Asegúrate de que la ruta es correcta

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await api.get(`/movie/${id}`);
      setMovie(response.data.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  };

  if (!movie) return <p>Cargando...</p>;

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong> {movie.overview}<br />
                <strong>Género:</strong> {movie.genre}<br />
                <strong>Duración:</strong> {formatDuration(movie.duration)}<br />
                <strong>Clasificación:</strong> {movie.rating}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetails;
