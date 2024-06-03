// services/api.js
import axios from 'axios';

// Base URL del backend
const baseURL = 'http://localhost:8888/api/v1';

// Crear una instancia de axios
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token de autenticación a cada solicitud
api.interceptors.request.use(
    (config) => {
        // Obtiene el token del almacenamiento local
        const authToken = localStorage.getItem('token');
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
