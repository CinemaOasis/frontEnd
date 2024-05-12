import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieCarousel = ({ movies }) => {
    const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
    };

    const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';


    return (
        <div className='carrusel-contenedor'>
        <h2>Exhibiéndose Ahora</h2>
            <Slider {...settings}>
                {movies.map(movie => (
                <div key={movie.id}>
                    <img src={`${imgBaseUrl}${movie.poster_path}`} alt={movie.name} />
                </div>
                ))}
            </Slider>
        </div>
    );
    };

    function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={className}
        style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
        />
    );
    }

    function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={className}
        style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
        />
    );
    }

export default MovieCarousel;
