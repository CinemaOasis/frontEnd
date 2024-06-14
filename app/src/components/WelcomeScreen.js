import React, { useEffect, useState } from 'react';
import logo from '../assets/Cinema (500 x 200 px).png'; // Asegúrate de que la ruta del logo es correcta
import '../assets/welcomeStyle.css'; // Asegúrate de que la ruta del archivo CSS es correcta

const WelcomeScreen = ({ onContinue }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(timer);
          onContinue();
          return 100;
        }
      });
    }, 30); // Ajusta la velocidad de la barra de progreso (30 ms * 100 = 3000 ms = 3 segundos)

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="welcome-logo" />
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
