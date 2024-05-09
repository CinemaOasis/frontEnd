// src/hooks/useMovies.js
import { useState, useEffect } from 'react';
import api from '../services/api';

function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/movies')
      .then(response => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return { movies, loading, error };
}

export default useMovies;
