import React, { useEffect, useState } from 'react';
import api from '../services/api';  // Asegúrate de usar la ruta correcta al archivo api.js

const Movies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        api.get('http://localhost:8888/api/v1/movie')
            .then(response => {
                console.log("Respuesta completa del servidor:", response); // Verifica cómo es el objeto de respuesta
                console.log("Datos de películas recibidos:", response.data.data); // Observa los datos específicos
                setMovies(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
            });
    }, []);  // El array vacío asegura que el efecto se ejecute solo una vez al montar

    return (
        <div>
            <h1>Películas</h1>
            {movies.length ? (
                <ul>
                    {movies.map(movie => (
                        <li key={movie.id}>{movie.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No hay películas disponibles.</p>
            )}
        </div>
    );
};

export default Movies;
