import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/Cinema (500 x 200 px).png';
import '../assets/headerAdmin.css';
import lupaBuscar from '../assets/lupaBuscar (2).png';
import { AuthContext } from '../services/authEmail'; // Asegúrate de que la ruta es correcta

const AdminHeader = ({ searchTerm, setSearchTerm, handleSearch, userName }) => {
    let navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

        const handleScroll = () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        logout(); // Llama a la función de logout del contexto de autenticación
        navigate('/'); // Redirige a la página de inicio
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <header>
            <div className='headerTop'>
                <img src={logo} alt="Cinema Oasis logo" className="logo" />
                <div className="barraBuscar">
                    <input 
                        type="text" 
                        placeholder='Buscar...' 
                        value={searchTerm} 
                        onChange={handleInputChange} 
                        onKeyPress={handleKeyPress} 
                    />
                    <button type='button' onClick={handleSearch}>
                        <img src={lupaBuscar} alt='Buscar' />
                    </button>
                </div>
                <div className='profileMenu'>
                    <div className="profileIcon" onClick={toggleMenu}>
                        {profileImage ? (
                            <img src={profileImage} alt="Perfil" className="profileImage"/>
                        ) : (
                            <FontAwesomeIcon icon={faUserCircle} size="2x" />
                        )}
                    </div>
                    {menuOpen && (
                        <div className='menu'>
                            <p>{userName}</p>
                            <label htmlFor="profileImageInput" className="profileImageLabel">
                                Cambiar foto de perfil
                            </label>
                            <input 
                                id="profileImageInput" 
                                type="file" 
                                accept="image/*" 
                                onChange={handleProfileImageChange} 
                            />
                            <button onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </div>

            <nav className="headerNav">
                <Link to="/adminPage">Cartelera</Link>
                <Link to="/adminEstrenos">Estrenos</Link>
                <Link to="/adminProximamente">Próximamente</Link>
            </nav>
            <button id="scrollToTopBtn" onClick={handleScrollToTop}>↑</button>
        </header>
    );
}

export default AdminHeader;
