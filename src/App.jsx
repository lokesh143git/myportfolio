import React, { useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import { ScrollButton } from './components/ScrollButton';
import { Canvas } from '@react-three/fiber';
import { useTheme } from './hooks/useTheme';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text3D, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: ${({ theme }) => theme.isDarkMode ?
    `linear-gradient(180deg, ${theme.colors.background} 0%, ${theme.colors.backgroundSecondary} 100%)` :
    theme.colors.background
  };
  color: ${({ theme }) => theme.colors.text};
  overflow-x: hidden;
  perspective: 2000px;
  transition: all var(--duration-medium2) var(--easing-emphasized);

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: ${({ theme }) => !theme.isDarkMode &&
      'radial-gradient(circle at top right, var(--surface-tint-light) 0%, transparent 70%)'
    };
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  transform-style: preserve-3d;
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 2rem;
  z-index: 2;
`;

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: auto;
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 2rem;
  width: 100%;
  max-width: 1200px;
`;

const Section = styled(motion.section)`
  min-height: 100vh;
  width: 100vw;
  padding: 100px 4rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 100px 2rem;
  }
`;

const Title = styled(motion.h1)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: ${({ theme }) => theme.isDarkMode ?
    `0 0 20px ${theme.colors.primary}4D` :
    'none'
  };
  letter-spacing: -0.02em;
  font-weight: 700;
  transition: all var(--duration-medium1) var(--easing-emphasized);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -0.5rem;
    width: 60px;
    height: 4px;
    background: ${({ theme }) => theme.colors.primary};
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    transition: transform var(--duration-medium2) var(--easing-emphasized-decelerate);
  }

  &:hover::after {
    transform: translateX(-50%) scaleX(1);
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 3rem;
  width: 100%;
  max-width: 1800px;
  margin: 3rem auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.isDarkMode ? 
    theme.colors.cardBackground : 
    `${theme.colors.background}${theme.isDarkMode ? '10' : 'FF'}`
  };
  border-radius: ${({ theme }) => theme.isDarkMode ? '20px' : '28px'};
  padding: 2.5rem;
  backdrop-filter: blur(${({ theme }) => theme.isDarkMode ? '10px' : '15px'});
  border: ${({ theme }) => theme.isDarkMode ? 
    `1px solid ${theme.colors.cardBorder}` : 
    'none'
  };
  transition: all var(--duration-medium2) var(--easing-emphasized);
  cursor: pointer;
  transform-style: preserve-3d;
  box-shadow: ${({ theme }) => theme.isDarkMode ?
    'none' :
    'var(--elevation-1)'
  };
  
  &:hover {
    transform: translateY(-8px);
    background: ${({ theme }) => theme.isDarkMode ?
      `${theme.colors.cardBackground}DD` :
      `${theme.colors.background}${theme.isDarkMode ? '15' : 'FF'}`
    };
    border-color: ${({ theme }) => theme.isDarkMode ?
      theme.colors.primary :
      'transparent'
    };
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 30px ${theme.colors.primary}33` :
      'var(--elevation-3)'
    };
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: ${({ theme }) => theme.isDarkMode ?
      `linear-gradient(45deg, transparent, transparent, ${theme.colors.primary})` :
      'none'
    };
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity var(--duration-medium1) var(--easing-standard);
  }

  &:hover::before {
    opacity: ${({ theme }) => theme.isDarkMode ? 1 : 0};
  }
  
  &:active {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 20px ${theme.colors.primary}26` :
      'var(--elevation-2)'
    };
  }
`;

const ExperienceCard = styled(ProjectCard)`
  background: ${({ theme }) => theme.isDarkMode ? 
    'rgba(255, 255, 255, 0.02)' : 
    `${theme.colors.background}${theme.isDarkMode ? '05' : 'FF'}`
  };
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1000px;
  box-shadow: ${({ theme }) => theme.isDarkMode ?
    'none' :
    'var(--elevation-1)'
  };

  &:hover {
    background: ${({ theme }) => theme.isDarkMode ?
      'rgba(255, 255, 255, 0.04)' :
      theme.colors.background
    };
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 30px ${theme.colors.primary}1A` :
      'var(--elevation-2)'
    };
  }
`;

const ContactSection = styled(Section)`
  min-height: 50vh;
`;

const ContactLinks = styled(motion.div)`
  display: flex;
  gap: 3rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Link = styled(motion.a)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 1.2rem;
  position: relative;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.isDarkMode ? '8px' : '12px'};
  transition: all var(--duration-short2) var(--easing-emphasized);
  background: ${({ theme }) => theme.isDarkMode ?
    'transparent' :
    'var(--surface-tint-light)'
  };
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: ${({ theme }) => theme.isDarkMode ?
      `linear-gradient(45deg, transparent, ${theme.colors.primary})` :
      'none'
    };
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity var(--duration-short2) var(--easing-standard);
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    background: ${({ theme }) => theme.isDarkMode ?
      `${theme.colors.primary}1A` :
      'var(--surface-tint-light-hover)'
    };
    box-shadow: ${({ theme }) => !theme.isDarkMode && 'var(--elevation-1)'};
  }
  
  &:hover::before {
    opacity: ${({ theme }) => theme.isDarkMode ? 1 : 0};
  }

  &:active {
    transform: translateY(0);
    background: ${({ theme }) => theme.isDarkMode ?
      `${theme.colors.primary}26` :
      'var(--state-pressed-light)'
    };
  }
`;

const ScrollDownButton = styled(motion.button)`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: ${({ theme }) => theme.isDarkMode ?
    `${theme.colors.primary}1A` :
    'var(--surface-tint-light)'
  };
  border: ${({ theme }) => theme.isDarkMode ?
    `2px solid ${theme.colors.primary}` :
    'none'
  };
  border-radius: ${({ theme }) => theme.isDarkMode ? '50%' : '16px'};
  pointer-events: auto;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  transition: all var(--duration-medium1) var(--easing-emphasized);
  outline: none;
  box-shadow: ${({ theme }) => theme.isDarkMode ?
    `0 0 20px ${theme.colors.primary}4D` :
    'var(--elevation-1)'
  };

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: ${({ theme }) => theme.isDarkMode ?
      `${theme.colors.primary}26` :
      'var(--surface-tint-light-hover)'
    };
    transform: translateY(-5px) translateX(-50%);
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 25px ${theme.colors.primary}4D` :
      'var(--elevation-2)'
    };
  }

  &:active {
    transform: translateY(2px) translateX(-50%);
    background: ${({ theme }) => theme.isDarkMode ?
      `${theme.colors.primary}33` :
      'var(--state-pressed-light)'
    };
    box-shadow: ${({ theme }) => theme.isDarkMode ?
      `0 0 15px ${theme.colors.primary}33` :
      'var(--elevation-1)'
    };
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

const StyledText = styled(motion.p)`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const StyledTitle = styled(motion.h2)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const StyledSubtitle = styled(motion.h3)`
  color: ${({ theme }) => theme.colors.textHighlight};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const StyledPeriod = styled(motion.p)`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const StyledTech = styled(motion.div)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  opacity: 0.8;
`;

function Scene() {
  const meshRef = useRef();
  const { colors, isDarkMode } = useTheme();
  
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls 
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping={true}
        enablePan={false}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE
        }}
      />
      <Stars 
        radius={100}
        depth={50} 
        count={7000} 
        factor={4} 
        saturation={0}
        fade
        speed={2}
        opacity={isDarkMode ? 1 : 0.5}
      />
      
      <Float speed={4} rotationIntensity={2} floatIntensity={2}>
        <group>
          <mesh position={[-4, 2, -5]}>
            <dodecahedronGeometry args={[1]} />
            <meshStandardMaterial
              color={colors.primary}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
          
          <mesh position={[4, -2, -5]}>
            <icosahedronGeometry args={[1]} />
            <meshStandardMaterial
              color={colors.primary}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
          
          <mesh ref={meshRef}>
            <torusKnotGeometry args={[3, 0.5, 128, 32]} />
            <meshPhongMaterial
              color={colors.primary}
              wireframe
              transparent
              opacity={0.2}
              shininess={100}
            />
          </mesh>
        </group>
      </Float>

      <SpotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={isDarkMode ? 2 : 1.5}
        color={colors.primary}
        distance={50}
        castShadow
      />
      
      <pointLight position={[-10, -10, -10]} color={colors.primary} intensity={isDarkMode ? 1 : 0.8} />
      <ambientLight intensity={isDarkMode ? 0.5 : 0.7} />
      
      <fogExp2 color={colors.background} density={isDarkMode ? 0.05 : 0.03} />
    </Canvas>
  );
}

const HeroTitle = styled(Title)`
  margin-bottom: 2rem;
`;

const HeroText = styled(StyledText)`
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

function App() {
  const { scrollYProgress } = useScroll();
  const contactRef = useRef(null);
  const { colors, isDarkMode } = useTheme();
  
  const scaleProgress = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const yProgress = useTransform(scrollYProgress, [0, 1], [0, -50]);


  useEffect(() => {
    // Component mounted
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const projects = [
    {
      title: "HRMS Software",
      company: "Cynosure Technologies",
      description: "Developed HRMS software with modules like E-DOC (document management), Learning and Development, HelpDesk, and Polls Survey.",
      tech: "ASP.NET, ASP.NET Core, MVC, React, Redux"
    },
    {
      title: "Grievance Management System",
      company: "E Connect Solutions",
      description: "Built the Rajasthan Grievances system for citizen grievance registration.",
      tech: "ASP.NET, ASP.NET Core, MVC"
    },
    {
      title: "ERP Software",
      company: "E Connect Solutions",
      description: "Developed ERP software for government organizations.",
      tech: "ASP.NET, ASP.NET Core, MVC"
    }
  ];

  const experiences = [
    {
      role: "Software Development Engineer",
      company: "Cynosure Technologies",
      period: "07/2024 - Present",
      description: "Leading development of HRMS software and related modules."
    },
    {
      role: "Software Development Engineer",
      company: "E Connect Solutions",
      period: "04/2022 - 07/2024",
      description: "Developed and maintained various government sector projects."
    }
  ];



  return (
    <StyledThemeProvider theme={{ colors, isDarkMode }}>
      <Container>
        <Navbar />
        <CanvasContainer>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </CanvasContainer>

        <ContentWrapper>
          <HeroSection className="hero-section">
            <HeroContent
              style={{
                scale: scaleProgress,
                opacity: opacityProgress,
                y: yProgress
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <HeroTitle
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
                }}
              >
                Hi, I'm a Software Developer
              </HeroTitle>
              <HeroText
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                A passionate software developer with 3+ years of experience in ASP.NET, ASP.NET Core, and modern web technologies.
              </HeroText>
            </HeroContent>
            <ScrollButton />
          </HeroSection>

          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={containerVariants}
            className="projects-section"
          >
            <Title variants={itemVariants}>Projects</Title>
            <ProjectGrid>
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <StyledTitle whileHover={{ scale: 1.05 }}>
                    {project.title}
                  </StyledTitle>
                  <StyledSubtitle>
                    {project.company}
                  </StyledSubtitle>
                  <StyledText>
                    {project.description}
                  </StyledText>
                  <StyledTech whileHover={{ x: 10 }}>
                    {project.tech}
                  </StyledTech>
                </ProjectCard>
              ))}
            </ProjectGrid>
          </Section>

          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={containerVariants}
            className="experience-section"
          >
            <Title variants={itemVariants}>Experience</Title>
            <motion.div style={{ width: "100%", maxWidth: "1400px" }}>
              {experiences.map((exp, index) => (
                <ExperienceCard
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <StyledTitle>
                    {exp.role}
                  </StyledTitle>
                  <StyledSubtitle>
                    {exp.company}
                  </StyledSubtitle>
                  <StyledPeriod>
                    {exp.period}
                  </StyledPeriod>
                  <StyledText>
                    {exp.description}
                  </StyledText>
                </ExperienceCard>
              ))}
            </motion.div>
          </Section>

          <ContactSection
            ref={contactRef}
            className="contact-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={containerVariants}
          >
            <Title variants={itemVariants}>Get In Touch</Title>
            <ContactLinks variants={containerVariants}>
              {[
                { text: "Email", href: "mailto:developer@example.com" },
                { text: "LinkedIn", href: "https://linkedin.com/in/developer" },
                { text: "GitHub", href: "https://github.com/developer" }
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.text}
                </Link>
              ))}
            </ContactLinks>
          </ContactSection>
        </ContentWrapper>
      </Container>
    </StyledThemeProvider>
  );
}

export default App;
