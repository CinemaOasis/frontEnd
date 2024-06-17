import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import logo from '../assets/Cinema (500 x 200 px).png';
import '../assets/headerUser.css';
import lupaBuscar from '../assets/lupaBuscar (2).png';
import { AuthContext } from '../services/authEmail';

const UserHeader = ({ searchTerm, setSearchTerm, handleSearch, userName }) => {
    let navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const { logout } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        navigate('/');
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
        setShowModal(!showModal);
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
                </div>
            </div>

            <nav className="headerNav">
                <Link to="/">Inicio</Link>
                <Link to="/cartelera">Cartelera</Link>
                <Link to="/estrenos">Estrenos</Link>
                <Link to="/proximamente">Próximamente</Link>
            </nav>

            <Modal show={showModal} onHide={toggleMenu}>
                <Modal.Header closeButton>
                    <Modal.Title>Perfil de Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        {profileImage ? (
                            <img src={profileImage} alt="Perfil" className="profileImageModal"/>
                        ) : (
                            <FontAwesomeIcon icon={faUserCircle} size="4x" />
                        )}
                        <h4>{userName}</h4>
                        <label htmlFor="profileImageInput" className="profileImageLabel">
                            Cambiar foto de perfil
                        </label>
                        <input 
                            id="profileImageInput" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleProfileImageChange} 
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleMenu}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                </Modal.Footer>
            </Modal>
        </header>
    );
}

export default UserHeader;
