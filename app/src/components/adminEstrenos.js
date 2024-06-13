import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import AdminHeader from '../components/adminHeader';

const AdminEstrenos = () => {
  const [estrenos, setEstrenos] = useState([]);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    handleLogin();
    fetchEstrenos();
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

  const fetchEstrenos = async () => {
    try {
      const response = await api.get('/funcion');
      const estrenosData = response.data.data.filter(funcion => funcion.isPremiere);
      setEstrenos(estrenosData);
    } catch (error) {
      console.error('Error fetching estrenos:', error);
      toast.error('Error fetching estrenos');
    }
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
          {estrenos.length > 0 ? (
            estrenos.map((funcion) => (
              <Col key={funcion.id} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${funcion.movie.poster_path}`} />
                  <Card.Body>
                    <Card.Title>{funcion.movie.name}</Card.Title>
                    <Card.Text>
                      Sala: {funcion.salaId} <br />
                      Comienza: {formatTime(funcion.startTime)} <br />
                      Termina: {formatTime(funcion.endTime)} <br />
                      Estado: {funcion.status} <br />
                      Estreno
                    </Card.Text>
                  </Card.Body>
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
