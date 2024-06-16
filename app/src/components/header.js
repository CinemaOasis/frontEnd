import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/Cinema (500 x 200 px).png';
import '../assets/header.css';
import lupaBuscar from '../assets/lupaBuscar (2).png'



const Header = () => {
    let navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/loginForm');  // Asegúrate de que esta ruta lleve al componente de login
    };

    const handleRegisterClick = () => {
        navigate('/registroForm');  // Asegúrate de que esta ruta lleve al componente de registro
    };
    return (
        <header>
            <div className='headerTop'>
                <img src={logo} alt="Cinema Oasis logo" className="logo"></img>
                <div className="barraBuscar">
                    <input type="text" placeholder='Buscar...' />
                    <button type='button'>
                        <img src={lupaBuscar} alt='Buscar'  />
                    </button>
                </div>
                <div className='loginButton'>
                    <button onClick={handleLoginClick}>Iniciar sesión</button>
                    <button onClick={handleRegisterClick} >Registrarse</button>
                </div>
            </div>

            <nav className="headerNav">
                <Link to="/homePage">Inicio</Link>
                <Link to="/Cartelera">Cartelera</Link>
                <Link to="/Estrenos">Estrenos</Link>
                <Link to="/Proximamente">Próximamente</Link>
            </nav>
        </header>
    );
} 

export default Header;