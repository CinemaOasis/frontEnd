// services/api.js
import axios from 'axios';

//Obtiene el token de almacenamiento local
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidWlkX2F6dXJlIjoiZHNkc1hTREUxNTAyIiwic3ViIjoiYWNjZXNzIiwiYXVkIjoidXNlciIsImV4cCI6MTcxNjM5Njk4My41NDMsImlhdCI6MTcxMzgwNDk4My41NDUsImp0aSI6IjhjOTU1ZTMyLTljM2EtNDc5ZC05ZTA3LTA3NmJhZDM5YTEzNiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WzFdfQ.jARaiHf1PWDni5bZX4pEQN3z1arPFOj9nyW3d3Vj8z0';

const baseURL = 'http://localhost:8888/api/v1'; // Asegúrate de cambiar esto por la URL real de tu backend

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
        // Agrega otros headers globales como tokens de autenticación aquí, si es necesario
    },
});

export default api;
