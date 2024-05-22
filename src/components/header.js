import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Cinema (500 x 200 px).png';
import '../assets/header.css';

const Header = () => {
    return (
        <header>
            <div className='headerTop'>
                <img src={logo} alt="Cinema Oasis logo" className="logo"></img>
                <div className="barraBuscar">
                    <input type="text" placeholder='Buscar película' />
                    <button type='button'>
                        <img src='lupaIcono' alt='Buscar'  />
                    </button>
                </div>
                <div className='loginButton'>
                    <button>Iniciar sesión</button>
                    <button>Registrarse</button>
                </div>
            </div>

            <nav className="headerNav">
                <Link to="/">Inicio</Link>
                <Link to="/">Estrenos</Link>
                <Link to="/">Próximamente</Link>
                <Link to="/">Contacto</Link>
            </nav>
        </header>
    );
}

export default Header;