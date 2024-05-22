import React from  "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{ background: '#343a40', padding: '10px' }}>
            <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around', color: 'white' }}>
                <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link></li>
                <li><Link to="/movies" style={{ color: 'white', textDecoration: 'none' }}>Estrenos</Link></li>
                <li><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>Próximamente</Link></li>
                <li><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>Contacto</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;