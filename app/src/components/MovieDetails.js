import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import api from '../services/api';
import '../assets/movieDetailsStyle.css'; // Asegúrate de que la ruta es correcta

const MovieDetails = ({ id }) => {
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
    <Container className="mt-5 movie-details">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{movie.name}</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong> {movie.description}<br />
                <strong>Género:</strong> {movie.genero.join(', ')}<br />
                <strong>Duración:</strong> {formatDuration(movie.duration)}<br />
                <strong>Clasificación:</strong> {movie.rating}<br />
                <strong>Fecha de Lanzamiento:</strong> {new Date(movie.fecha_lanzamiento).toLocaleDateString()}<br />
              </Card.Text>
              {movie.trailer_key && (
                <div className="trailer">
                  <h5>Tráiler</h5>
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${movie.trailer_key}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetails;