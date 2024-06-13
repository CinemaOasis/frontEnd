import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginForm from '../src/components/loginForm';
import RegisterForm from '../src/components/registroForm';
import AdminPage from './components/adminPage';
import ConfirmEmail from './components/confirmEmail';
import AdminProximamente from './components/adminProximamente';
import AdminEstrenos from './components/adminEstrenos';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} /> 
        <Route path='/loginForm' element={<LoginForm />} /> 
        <Route path='/registroForm' element={<RegisterForm />} /> 
        <Route path='/adminPage' element={<AdminPage />} /> 
        <Route path='/adminEstrenos' element={<AdminEstrenos category="Estrenos" />} />
        <Route path='/adminProximamente' element={<AdminProximamente/>} />
        <Route path="/confirm" element={<ConfirmEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
