// En tu archivo de componente o en un archivo de estilos global
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MovieCarousel from '../components/movieCarrusel'; // Asegúrate de que la ruta es correcta
import Header from "../components/header";
//import Header from '../components/header'; // Si tienes un componente para el header
import '../assets/movieCarrusel.css';


const HomePage = () => {
    const [movies, setMovies] = useState([]);
    

    useEffect(() => {
        api.get('http://localhost:8888/api/v1/movie')
            .then(response => {
                setMovies(response.data.data); // Ajusta según la estructura de tu respuesta
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
            });
    }, []);

    return (
        <div>
            <Header/>
            <MovieCarousel movies={movies} />
            {/* Otros componentes como Footer, etc. */}
        </div>
    );
};

export default HomePage;
