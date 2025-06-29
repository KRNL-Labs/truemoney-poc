"use client";

import { useState, useEffect, useRef } from 'react';

interface HeroSectionProps {
  walletConnected: boolean;
}

export const HeroSection = ({ walletConnected }: HeroSectionProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const [matrixInitialized, setMatrixInitialized] = useState(false);

  // Handle scroll and mouse movement
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Matrix animation effect
  useEffect(() => {
    if (!matrixCanvasRef.current || matrixInitialized) return;
    
    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix code characters (using more tech/code-like characters)
    const matrix = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    // Setting up the drops
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
    }

    // Drawing the matrix effect
    const draw = () => {
      // Black with opacity creates the fade effect for previous characters
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0'; // Matrix green
      ctx.font = `${fontSize}px monospace`;
      
      // Looping over drops
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Move the drop down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, 35);
    setMatrixInitialized(true);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [matrixInitialized]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Matrix Canvas Background */}
      <canvas 
        ref={matrixCanvasRef} 
        className="absolute inset-0 z-0 opacity-40"
      />
      
      {/* Additional Background Layers */}
      <div className="absolute inset-0 z-10">
        {/* Layer 1: Matrix-style grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 20px 20px, 20px 20px',
            animation: 'gridFlow 40s linear infinite',
          }}
        />
        
        {/* Layer 2: Binary code patterns */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.12}px)`,
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 50%)
            `,
            animation: 'circuitPulse 25s ease-in-out infinite',
          }}
        />

        {/* Layer 3: Floating binary symbols */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translate(${scrollY * 0.15}px, ${-scrollY * 0.1}px)`,
          }}
        >
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white/20 transform rotate-45 flex items-center justify-center"
              style={{
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <span className="text-white/40 text-xs">
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Mouse-Responsive Matrix Gradients */}
      <div 
        className="absolute inset-0 opacity-40 z-20"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.08) 15%, 
              transparent 40%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              rgba(0, 255, 0, 0.05) 0%, 
              transparent 30%)
          `,
          transition: 'background 0.3s ease',
        }}
      />

      {/* Animated Matrix Code Particles */}
      <div className="absolute inset-0 z-15">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute font-mono text-xs text-green-400 opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particleFloat ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              textShadow: '0 0 5px rgba(0, 255, 0, 0.7)',
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      {/* Matrix-style Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 z-25" />

      {/* Main Content */}
      <div 
        className="relative z-30 flex items-center justify-center min-h-screen w-screen"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
          height: '100vh', /* Force exact viewport height */
          maxWidth: '100%', /* Ensure full width */
          overflow: 'hidden', /* Prevent horizontal scrolling */
        }}
      >
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Matrix-Style Title */}
          <div className="mb-8">
            <div className="inline-block mb-4">
              <span className="text-sm font-mono text-green-400 tracking-widest uppercase opacity-80">
                {/* SYSTEM INITIALIZED */}
                {"<SYSTEM INITIALIZED>"}
              </span>
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none tracking-tight font-mono">
              <span 
                className="inline-block text-white"
                style={{
                  textShadow: '0 0 40px rgba(0, 255, 0, 0.3)',
                  animation: 'matrixGlow 4s ease-in-out infinite',
                }}
              >
                P2P
              </span>
              <br />
              <span 
                className="inline-block text-green-400"
                style={{
                  textShadow: '0 0 40px rgba(0, 255, 0, 0.4)',
                  animation: 'matrixGlow 4s ease-in-out infinite 2s',
                }}
              >
                MARKETPLACE
              </span>
            </h1>
          </div>

          {/* Matrix-style Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed font-light tracking-wide font-mono">
            {walletConnected
              ? 'SECURE DIGITAL GAMES ASSET EXCHANGE PROTOCOL'
              : 'CONNECT WALLET TO START TRADING DIGITAL GAMES ASSETS'}
          </p>

          {/* Matrix Feature Tags */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-full blur-xl group-hover:blur-lg transition-all duration-300" />
              <div className="relative flex items-center bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full border border-green-500/30 hover:border-green-400/60 transition-all duration-300">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse shadow-lg shadow-green-400/50" />
                <span className="text-green-400 font-mono tracking-wider text-sm group-hover:text-white transition-colors">
                  VERIFIED BY CHAINANALYSIS
                </span>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-xl group-hover:blur-lg transition-all duration-300" />
              <div className="relative flex items-center bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 hover:border-white/60 transition-all duration-300">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse shadow-lg shadow-white/50" style={{ animationDelay: '0.5s' }} />
                <span className="text-white font-mono tracking-wider text-sm group-hover:text-green-400 transition-colors">
                  POWERED BY KRNL
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Matrix-style Scroll Indicator */}
      {scrollY < 80 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-opacity duration-300" style={{ opacity: Math.max(0, 1 - scrollY / 80) }}>
          <div className="flex flex-col items-center text-green-400 animate-bounce">
            <div className="w-6 h-10 border-2 border-green-500/50 mb-2 relative">
              <div className="w-1 h-3 bg-green-400 absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse" />
            </div>
            <span className="text-xs font-mono tracking-widest uppercase">SCROLL_DOWN</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gridFlow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes circuitPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes particleFloat {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        
        @keyframes matrixGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(0, 255, 0, 0.6)); }
        }
        
        @keyframes matrixRain {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #00ff00;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        
        .glitch-text::after {
          left: -2px;
          text-shadow: 2px 0 #00ff00;
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); }
          20% { clip-path: inset(60% 0 40% 0); }
          40% { clip-path: inset(40% 0 60% 0); }
          60% { clip-path: inset(80% 0 20% 0); }
          80% { clip-path: inset(10% 0 90% 0); }
          100% { clip-path: inset(30% 0 70% 0); }
        }
        
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 90% 0); }
          20% { clip-path: inset(30% 0 70% 0); }
          40% { clip-path: inset(50% 0 50% 0); }
          60% { clip-path: inset(70% 0 30% 0); }
          80% { clip-path: inset(90% 0 10% 0); }
          100% { clip-path: inset(5% 0 95% 0); }
        }
      `}</style>
    </div>
  );
};

// Component is already exported as a named export