import axios from 'axios';

// URL base para todas las llamadas a la API de autenticación
const API_BASE_URL = 'http://localhost:8888/api/v1/auth';

// Función para iniciar sesión
export function login(username, password) {
  return axios.post(`${API_BASE_URL}/login`, { username, password })
    .then(response => {
      const { token } = response.data;
      // Guardar token en el almacenamiento local
      localStorage.setItem('token', token);
      // Opcionalmente, redirigir al usuario o hacer otra acción
      window.location.reload();
    })
    .catch(error => {
      console.error('Error de inicio de sesión:', error);
      throw error;  // Re-lanzar el error si necesitas manejo adicional en otro lugar
    });
}

// Exportar otras funciones relacionadas con la autenticación si son necesarias
