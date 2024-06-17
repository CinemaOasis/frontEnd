import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import UserHeader from '../components/usuarioHeader';
import Header from '../components/header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import CinemaPhoto from '../assets/CinemaOasis.jpg';
import { AuthContext } from '../services/authEmail';
import '../assets/inicioStyle.css';

const Inicio = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div>
      {isAuthenticated && user ? (
        <UserHeader searchTerm={''} setSearchTerm={() => {}} handleSearch={() => {}} userName={user.name || (user.email && user.email.split('@')[0])} />
      ) : (
        <Header />
      )}
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Bienvenido a Cinema Oasis</h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6} className="d-flex align-items-center">
            <p className="lead">
              En Cinema Oasis, te ofrecemos una experiencia cinematográfica inigualable. Disfruta de las últimas películas en cartelera, explora nuestros próximos estrenos y compra tus taquillas online de manera rápida y sencilla. ¡Te invitamos a vivir la magia del cine con nosotros!
            </p>
          </Col>
          <Col md={6}>
            <img src={CinemaPhoto} alt="Cinema Oasis" className="img-fluid rounded" />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Cartelera</Card.Title>
                <Card.Text>
                  Explora las películas actualmente en cartelera y encuentra tu próxima aventura cinematográfica.
                </Card.Text>
                <Button variant="primary" href="/cartelera">Ver Cartelera</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Próximos Estrenos</Card.Title>
                <Card.Text>
                  Descubre las películas que están por llegar. ¡No te pierdas ningún estreno!
                </Card.Text>
                <Button variant="primary" href="/proximamente">Ver Próximamente</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Compra de Taquillas</Card.Title>
                <Card.Text>
                  Compra tus taquillas en línea de manera rápida y sencilla. ¡Asegura tu lugar para las películas más esperadas!
                </Card.Text>
                <Button variant="primary" href="/comprar-taquilla">Comprar Taquillas</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <h2>¿Por qué elegir Cinema Oasis?</h2>
            <p className="lead">
              En Cinema Oasis, nos enorgullece ofrecer a nuestros clientes una experiencia cinematográfica de primera clase. Desde nuestras cómodas salas hasta nuestra avanzada tecnología de proyección y sonido, cada detalle está diseñado para brindarte la mejor experiencia posible. ¡Ven y descubre por qué Cinema Oasis es el lugar ideal para disfrutar de tus películas favoritas!
            </p>
          </Col>
        </Row>
      </Container>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default Inicio;
