/*import React from "react";
import Button from "../components/Button";

const MovieCard = ({ movie }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', width: '300px' }}>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%' }} />
            <h3>{movie.title}</h3>
            <p>{movie.summary}</p>
            <Button text="Ver detalles" onClick={() => console.log("Ver detalles de la película")} />
        </div>
    );
};

export default MovieCard;*/

// services/movieService.js
import api from './api';

export const fetchMovies = async () => {
    try {
        const response = await api.get('/movies');
        return response.data;
    } catch (error) {
        throw error;
    }
};
