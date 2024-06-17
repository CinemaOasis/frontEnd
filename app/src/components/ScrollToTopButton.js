// components/ScrollToTopButton.js

import React, { useState, useEffect } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';
import '../assets/scrollToTopButtonStyle.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <div onClick={scrollToTop}>
          <FaArrowCircleUp size="3em" />
        </div>
      )}
    </div>
  );
};

export default ScrollToTopButton;
