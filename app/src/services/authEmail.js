import React, { createContext, useState, useEffect } from 'react';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token al cargar:', token); // Verificar token al cargar
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/emailauth/user')
                .then((response) => {
                    console.log('Datos del usuario:', response.data);
                    setUser(response.data);
                    setIsAuthenticated(true);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token'); // Eliminar token si es inválido
                });
        }
    }, []);

    const login = (userData) => {
        const token = userData.token;
        setIsAuthenticated(true);
        setUser(userData.user); // Asegúrate de que esta línea acceda correctamente al objeto usuario
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token después del login:', token); // Verificar token después del login
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
