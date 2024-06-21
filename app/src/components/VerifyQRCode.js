import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import api from '../services/api';

const VerifyQRCodePage = () => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const { ticketId } = useParams(); // Usar useParams para obtener el ticketId de la URL

  useEffect(() => {
    console.log('Ticket ID recibido en useEffect:', ticketId); // Log para verificar el ticketId

    if (ticketId) {
      verifyQRCode(ticketId);
    } else {
      setError('Código QR no proporcionado.');
    }
  }, [ticketId]);

  const verifyQRCode = async (ticketId) => {
    try {
      console.log('Enviando solicitud al backend con ticketId:', ticketId); // Log antes de enviar la solicitud
      const response = await api.post('/comprartaquilla/verify-qr', { qrCode: ticketId });
      console.log('Respuesta del backend:', response.data); // Log para verificar la respuesta del backend
      setVerificationResult(response.data);
      setError(null);
    } catch (error) {
      console.error('Error verificando el código QR:', error.response?.data || error.message); // Log para depurar errores
      setError(error.response?.data?.message || 'Error verificando el código QR');
      setVerificationResult(null);
    }
  };

  const formatTime = (minutes) => {
    if (isNaN(minutes)) {
      return 'Horario desconocido';
    }
    const hours24 = Math.floor(minutes / 60);
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const mins = (minutes % 60).toString().padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    return `${hours12}:${mins} ${ampm}`;
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={12} className="text-center">
          <h1>Verificación de Código QR</h1>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {verificationResult && (
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>{verificationResult.compra?.funcion?.movie?.name || 'Película desconocida'}</Card.Title>
                <Card.Text>
                  Sala: {verificationResult.compra?.funcion?.sala?.name || 'Sala desconocida'}<br />
                  Horario: {verificationResult.compra?.funcion?.startTime ? formatTime(Number(verificationResult.compra.funcion.startTime)) : 'Horario desconocido'}<br />
                  Cantidad de Taquillas: {verificationResult.compra?.cantidadTaquillas || 'Desconocido'}<br />
                  Tipo de Taquilla: {verificationResult.compra?.tipoTaquilla || 'Desconocido'}<br />
                  Estado: {verificationResult.compra?.estadoTransaccion || 'Desconocido'}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyQRCodePage;
