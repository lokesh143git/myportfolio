import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTheme } from '../hooks/useTheme';

const ScrollDownButton = styled(motion.button)`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: ${({ theme }) => theme.isDarkMode ? 
    'rgba(100, 255, 218, 0.1)' : 
    'rgba(0, 108, 81, 0.05)'
  };
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  transition: all var(--duration-medium) var(--easing-standard);
  outline: none;
  box-shadow: ${({ theme }) => theme.isDarkMode ?
    '0 0 20px rgba(100, 255, 218, 0.3)' :
    'var(--elevation-1)'
  };

  svg {
    width: 24px;
    height: 24px;
    transition: transform var(--duration-short) var(--easing-standard);
  }

  &:hover {
    background: ${({ theme }) => theme.isDarkMode ?
      'rgba(100, 255, 218, 0.15)' :
      'rgba(0, 108, 81, 0.1)'
    };
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      '0 0 30px rgba(100, 255, 218, 0.4)' :
      'var(--elevation-2)'
    };

    svg {
      transform: translateY(2px);
    }
  }

  @media (max-width: 768px) {
    bottom: 30px;
    width: 42px;
    height: 42px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollY <= windowHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <StyledThemeProvider theme={{ colors, isDarkMode }}>
      <ScrollDownButton
        onClick={() => {
          const contactSection = document.querySelector('.contact-section');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: [0, -12, 0],
          opacity: 1,
          transition: {
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            },
            opacity: {
              duration: 0.4
            }
          }
        }}
        whileHover={{ 
          scale: 1.15,
          backgroundColor: 'rgba(100, 255, 218, 0.2)',
          boxShadow: '0 0 30px rgba(100, 255, 218, 0.5)'
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to Contact"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </ScrollDownButton>
    </StyledThemeProvider>
  );
};
