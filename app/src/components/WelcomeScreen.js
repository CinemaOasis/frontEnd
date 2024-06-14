import React, { useEffect } from 'react';

const WelcomeScreen = ({ name, onContinue }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000); // Cambia el tiempo según sea necesario (3000 ms = 3 segundos)

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Bienvenido, {name}</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: '48px',
    color: '#333',
  },
};

export default WelcomeScreen;
