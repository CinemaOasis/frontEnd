/*import React from 'react';
import MoviesList from './components/MovieList';

function App() {
  return (
    <div className="App">
      <MoviesList />
    </div>
  );
}

export default App;*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
//import './assets/movieCarrusel.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
