import React, { useState } from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { darkTheme, lightTheme } from '../context/theme';

const NavContainer = styled.nav`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: transparent;
  transition: all var(--duration-medium) var(--easing-standard);
`;

const MenuButton = styled(motion.button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.navBackground};
  border: ${({ theme }) => theme.isDarkMode ?
    `1px solid ${theme.primary}` :
    'none'
  };
  border-radius: ${({ theme }) => theme.isDarkMode ? '50%' : '16px'};
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  width: 50px;
  height: 50px;
  position: relative;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) => theme.isDarkMode ?
    `0 0 20px ${theme.primary}33` :
    'var(--elevation-1)'
  };
  transition: all var(--duration-medium) var(--easing-standard);
  
  &:hover {
    background: ${({ theme }) => theme.isDarkMode ?
      theme.cardBackground :
      `${theme.primary}10`
    };
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 30px ${theme.primary}4D` :
      'var(--elevation-2)'
    };
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 15px ${theme.primary}33` :
      'var(--elevation-1)'
    };
  }
`;

const ThemeToggle = styled(motion.button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.navBackground};
  border: ${({ theme }) => theme.isDarkMode ? `1px solid ${theme.primary}` : 'none'};
  border-radius: ${({ theme }) => theme.isDarkMode ? '50%' : '16px'};
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  width: 50px;
  height: 50px;
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1000;
  backdrop-filter: blur(${({ theme }) => theme.isDarkMode ? '10px' : '15px'});
  box-shadow: ${({ theme }) => theme.isDarkMode ? 
    `0 0 20px ${theme.primary}33` :
    'var(--elevation-1)'
  };
  transition: all var(--duration-medium) var(--easing-standard);
  
  &:hover {
    background: ${({ theme }) => theme.isDarkMode ?
      theme.cardBackground :
      `${theme.primary}10`
    };
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 30px ${theme.primary}4D` :
      'var(--elevation-2)'
    };
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 15px ${theme.primary}33` :
      'var(--elevation-1)'
    };
  }
`;

const Menu = styled(motion.div)`
  position: absolute;
  top: 70px;
  right: 0;
  background: ${({ theme }) => theme.navBackground};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: ${({ theme }) => theme.isDarkMode ? `1px solid ${theme.primary}33` : 'none'};
  box-shadow: ${({ theme }) => theme.isDarkMode ?
    `0 0 20px ${theme.primary}33` :
    'var(--elevation-2)'
  };
`;

const MenuItem = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all var(--duration-medium) var(--easing-standard);
  white-space: nowrap;
  
  &:hover {
    background: ${({ theme }) => theme.isDarkMode ?
      theme.cardBackground :
      `${theme.primary}10`
    };
  }
`;

const menuVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <StyledThemeProvider theme={{ ...isDarkMode ? darkTheme : lightTheme, isDarkMode }}>
      <>
        <ThemeToggle onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </ThemeToggle>
        
        <NavContainer>
          <MenuButton onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </MenuButton>

          <AnimatePresence>
            {isMenuOpen && (
              <Menu
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <MenuItem href="#about">About</MenuItem>
                <MenuItem href="#experience">Experience</MenuItem>
                <MenuItem href="#projects">Projects</MenuItem>
                <MenuItem href="#contact">Contact</MenuItem>
              </Menu>
            )}
          </AnimatePresence>
        </NavContainer>
      </>
    </StyledThemeProvider>
  );
};

export default Navbar;
