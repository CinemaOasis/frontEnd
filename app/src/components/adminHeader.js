import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/Cinema (500 x 200 px).png';
import '../assets/headerAdmin.css';
import lupaBuscar from '../assets/lupaBuscar (2).png';

const AdminHeader = ({ searchTerm, setSearchTerm, handleSearch, userName }) => {
    let navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
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
        </header>
    );
}

export default AdminHeader;
