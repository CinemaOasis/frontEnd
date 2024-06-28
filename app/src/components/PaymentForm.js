import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserHeader from '../components/usuarioHeader';
import Header from '../components/header';
import Footer from '../components/Footer';
import { AuthContext } from '../services/authEmail';
import '../assets/paymentPageStyle.css';

const PaymentPage = () => {
  const { funcionId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [funcion, setFuncion] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedSala, setSelectedSala] = useState('');
  const [selectedHorario, setSelectedHorario] = useState('');
  const [cantidadTaquillas, setCantidadTaquillas] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFuncion = async () => {
      try {
        const response = await api.get(`/funcion/${funcionId}`);
        setFuncion(response.data);
        setSelectedSala(response.data.salaId);
        setSelectedHorario(response.data.startTime);
      } catch (error) {
        console.error('Error fetching funcion:', error);
      }
    };

    fetchFuncion();
  }, [funcionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: name,
        email: email,
      },
    });

    if (error) {
      console.error(error);
      alert('Error al crear el método de pago');
      return;
    }

    const response = await api.post('/comprartaquilla/purchase', {
      userId: user.id,
      funcionId: funcion.id,
      salaId: selectedSala,
      horario: selectedHorario,
      cantidadTaquillas: cantidadTaquillas,
      paymentMethodId: paymentMethod.id,
    });

    if (response.data) {
      navigate('/cartelera');
    } else {
      alert('Error al realizar la compra');
    }
  };

  return (
    <div>
      {isAuthenticated && user ? (
        <UserHeader searchTerm={''} setSearchTerm={() => {}} handleSearch={() => {}} userName={user.name || (user.email && user.email.split('@')[0])} />
      ) : (
        <Header />
      )}
      <Container className="mt-5">
        {funcion ? (
          <Row>
            <Col md={8} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Comprar Boletos para {funcion.movie.name}</Card.Title>
                  <Card.Text>
                    Sala: {funcion.Sala.name}<br />
                    Horario: {funcion.startTime}
                  </Card.Text>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="name">
                      <Form.Label>Nombre en la Tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="cantidad">
  <Form.Label>Cantidad de Taquillas</Form.Label>
  <Form.Control
    type="number"
    value={cantidadTaquillas}
    onChange={(e) => {
      const value = e.target.value;
      setCantidadTaquillas(value ? parseInt(value, 10) : 0);
    }}
    min="1"
    max="5"
    required
  />
</Form.Group>
                    <Form.Group controlId="card">
                      <Form.Label>Información de la Tarjeta</Form.Label>
                      <CardElement />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Comprar
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <p>Cargando datos de la función...</p>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default PaymentPage;
