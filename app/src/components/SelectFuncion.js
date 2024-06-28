import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import UserHeader from '../components/usuarioHeader';
import Header from '../components/header';
import Footer from '../components/Footer';
import { AuthContext } from '../services/authEmail';
import api from '../services/api';
import '../assets/paymentPageStyle.css'; // Asegúrate de incluir los estilos CSS personalizados

const SelectFuncion = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const [funciones, setFunciones] = useState([]);
  const [selectedFuncion, setSelectedFuncion] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cantidadTaquillas, setCantidadTaquillas] = useState(1);
  const [tipoTaquilla, setTipoTaquilla] = useState('Regular');
  const [total, setTotal] = useState(150);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const USD_TO_DOP_CONVERSION_RATE = 59.30;
  const MIN_USD_AMOUNT = 0.5;
  const MIN_DOP_AMOUNT = Math.ceil(MIN_USD_AMOUNT * USD_TO_DOP_CONVERSION_RATE); // Redondear hacia arriba para asegurarse de cumplir con el requisito

  useEffect(() => {
    const funcionesFromState = location.state?.funciones || [];
    setFunciones(funcionesFromState);
  }, [location.state]);

  useEffect(() => {
    const pricePerTicket = tipoTaquilla === 'VIP' ? 250 : 150;
    setTotal(pricePerTicket * cantidadTaquillas);
  }, [cantidadTaquillas, tipoTaquilla]);

  const handleSelectFuncion = (funcion) => {
    setSelectedFuncion(funcion);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1 || value > 5) {
      setError('La cantidad de taquillas debe estar entre 1 y 5.');
      setCantidadTaquillas(1);
    } else {
      setError('');
      setCantidadTaquillas(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert('Stripe no está completamente cargado. Intenta nuevamente.');
      return;
    }

    if (!selectedFuncion || !selectedFuncion.salaId || !selectedFuncion.movie) {
      alert('Por favor seleccione una función válida.');
      return;
    }

    if (cantidadTaquillas < 1 || cantidadTaquillas > 5) {
      alert('La cantidad de taquillas debe estar entre 1 y 5.');
      return;
    }

    if (total < MIN_DOP_AMOUNT) {
      alert(`El monto mínimo de compra debe ser al menos ${MIN_DOP_AMOUNT} DOP.`);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: name,
        email: email,
      },
    });

    if (error) {
      console.error('Error al crear el método de pago:', error);
      alert('Error al crear el método de pago: ' + error.message);
      return;
    }

    try {
      console.log('Enviando solicitud de compra:', {
        userId: user.id,
        funcionId: selectedFuncion.id,
        salaId: selectedFuncion.salaId,
        cantidadTaquillas: cantidadTaquillas,
        tipoTaquilla: tipoTaquilla,
        paymentMethodId: paymentMethod.id,
      });

      const response = await api.post('/payment/purchase', {
        userId: user.id,
        funcionId: selectedFuncion.id,
        salaId: selectedFuncion.salaId,
        cantidadTaquillas: cantidadTaquillas,
        tipoTaquilla: tipoTaquilla,
        paymentMethodId: paymentMethod.id,
      });

      if (response.data) {
        navigate('/cartelera');
      } else {
        alert('Error al realizar la compra');
      }
    } catch (error) {
      console.error('Error en la compra:', error);
      alert('Error al realizar la compra: ' + error.message);
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
      {isAuthenticated && user ? (
        <UserHeader searchTerm={''} setSearchTerm={() => {}} handleSearch={() => {}} userName={user.name || (user.email && user.email.split('@')[0])} />
      ) : (
        <Header />
      )}
      <Container className="mt-5">
        {!selectedFuncion && (
          <Row>
            {funciones.length > 0 ? (
              funciones.map((funcion) => (
                <Col key={funcion.id} md={6} className="mb-4">
                  <Card onClick={() => handleSelectFuncion(funcion)}>
                    <Card.Body className="d-flex">
                      <Image src={`https://image.tmdb.org/t/p/w500${funcion.movie.poster_path}`} thumbnail style={{ width: '100px', height: '150px' }} />
                      <div className="ml-3">
                        <Card.Title>{funcion.movie.name}</Card.Title>
                        <Card.Text>
                          Sala: {funcion.salaId}<br />
                          Horario: {formatTime(funcion.startTime)}<br />
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No hay funciones disponibles</p>
            )}
          </Row>
        )}
        {selectedFuncion && (
          <Row className="mt-4">
            <Col>
              <Card className="mb-4">
                <Card.Body className="d-flex">
                  <Image src={`https://image.tmdb.org/t/p/w500${selectedFuncion.movie.poster_path}`} thumbnail style={{ width: '100px', height: '150px' }} />
                  <div className="ml-3">
                    <Card.Title>{selectedFuncion.movie.name}</Card.Title>
                    <Card.Text>
                      Sala: {selectedFuncion.salaId}<br />
                      Horario: {formatTime(selectedFuncion.startTime)}<br />
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
              <Form.Group controlId="cantidad">
                <Form.Label>Cantidad de Taquillas</Form.Label>
                <Form.Control
                  type="number"
                  value={cantidadTaquillas}
                  onChange={handleQuantityChange}
                  min="1"
                  max="5"
                  required
                />
              </Form.Group>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <Form.Group controlId="tipoTaquilla">
                <Form.Label>Tipo de Taquilla</Form.Label>
                <Form.Control
                  as="select"
                  value={tipoTaquilla}
                  onChange={(e) => setTipoTaquilla(e.target.value)}
                  required
                >
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                </Form.Control>
              </Form.Group>
              <div className="mt-3">
                <strong>Total a Pagar: {total} DOP</strong>
              </div>
              <Form onSubmit={handleSubmit} className="payment-form mt-4">
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
                <Form.Group controlId="cardNumber">
                  <Form.Label>Número de Tarjeta</Form.Label>
                  <div className="card-element-wrapper">
                    <CardNumberElement className="card-element" />
                  </div>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="cardExpiry">
                      <Form.Label>Fecha de Expiración</Form.Label>
                      <div className="card-element-wrapper">
                        <CardExpiryElement className="card-element" />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="cardCvc">
                      <Form.Label>CVC</Form.Label>
                      <div className="card-element-wrapper">
                        <CardCvcElement className="card-element" />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="payment-button">
                  Pagar
                </Button>
              </Form>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default SelectFuncion;
