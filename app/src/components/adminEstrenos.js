import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import AdminHeader from '../components/adminHeader';

const AdminEstrenos = () => {
  const [estrenos, setEstrenos] = useState([]);
  const [groupedEstrenos, setGroupedEstrenos] = useState([]);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    handleLogin();
    fetchEstrenos();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post('/emailauth/login', {
        email: 'wanderdj77@gmail.com',
        password: 'adminadmin',
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

  const fetchEstrenos = async () => {
    try {
      const response = await api.get('/funcion');
      const estrenosData = response.data.data.filter(funcion => funcion.isPremiere);
      setEstrenos(estrenosData);
      groupEstrenos(estrenosData);
    } catch (error) {
      console.error('Error fetching estrenos:', error);
      toast.error('Error fetching estrenos');
    }
  };

  const groupEstrenos = (estrenos) => {
    const grouped = estrenos.reduce((acc, funcion) => {
      const key = `${funcion.movie.id}-${funcion.isWeekend}`;
      if (!acc[key]) {
        acc[key] = { movie: funcion.movie, funciones: [] };
      }
      acc[key].funciones.push(funcion);
      return acc;
    }, {});

    setGroupedEstrenos(Object.values(grouped));
  };

  const formatTime = (minutes) => {
    const hours24 = Math.floor(minutes / 60);
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const mins = (minutes % 60).toString().padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    return `${hours12}:${mins} ${ampm}`;
  };

  return (
    <div>
      <AdminHeader userName={userName} />
      <Container className="mt-5">
        <ToastContainer />
        <Row>
          <Col>
            <h1>Estrenos</h1>
          </Col>
        </Row>
        <Row className="mt-4">
          {groupedEstrenos.length > 0 ? (
            groupedEstrenos.map((group) => (
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
                          <Badge bg="warning" text="dark">Estreno</Badge>
                          {group.funciones.some(funcion => funcion.isWeekend) && <Badge bg="info" text="dark">Fin de Semana</Badge>}
                        </Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay estrenos disponibles</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default AdminEstrenos;
