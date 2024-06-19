import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import UserHeader from '../components/usuarioHeader';
import Header from '../components/header';
import Footer from '../components/Footer';
import { AuthContext } from '../services/authEmail';

const SelectFuncion = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const [funciones, setFunciones] = useState([]);
  const [selectedFuncion, setSelectedFuncion] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const funcionesFromState = location.state?.funciones || [];
    setFunciones(funcionesFromState);
  }, [location.state]);

  const handleSelectFuncion = (funcion) => {
    setSelectedFuncion(funcion);
  };

  const handleProceedToPayment = () => {
    if (selectedFuncion) {
      navigate(`/payment/${selectedFuncion.id}`, { state: { cantidadTaquillas: 1 } });
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
        <Row>
          {funciones.length > 0 ? (
            funciones.map((funcion) => (
              <Col key={funcion.id} md={6} className="mb-4">
                <Card className={selectedFuncion && selectedFuncion.id === funcion.id ? 'selected' : ''} onClick={() => handleSelectFuncion(funcion)}>
                  <Card.Body>
                    <Card.Title>{funcion.movie.name}</Card.Title>
                    <Card.Text>
                      Sala: {funcion.salaId}<br />
                      Horario: {formatTime(funcion.startTime)}<br />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay funciones disponibles</p>
          )}
        </Row>
        {selectedFuncion && (
          <Row className="mt-4">
            <Col>
              <Button variant="primary" onClick={handleProceedToPayment}>
                Proceder al Pago
              </Button>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default SelectFuncion;

