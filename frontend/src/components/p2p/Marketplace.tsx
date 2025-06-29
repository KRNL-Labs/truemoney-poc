"use client";

import { useState } from 'react';
import Image from 'next/image';

// Mock data for the games marketplace
const GAME_CATEGORIES = ['All', 'Action', 'Adventure', 'RPG', 'FPS', 'Sports', 'Racing', 'Simulation'];

const FEATURED_GAMES = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077',
    description: 'Premium weapons and character skins from Night City',
    publisher: 'CD Projekt Red',
    itemCount: 157,
    verifiedSellers: 24,
    image: '/cyberpunk.jpg',
    featured: true
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    description: 'Legendary weapons and armor from the Lands Between',
    publisher: 'FromSoftware',
    itemCount: 203,
    verifiedSellers: 41,
    image: '/elden-ring.jpg',
    featured: true
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    description: 'Rare skins and emotes for the battle royale',
    publisher: 'Epic Games',
    itemCount: 430,
    verifiedSellers: 86,
    image: '/fortnite.jpg',
    wide: true
  },
  {
    id: 'valorant',
    title: 'Valorant',
    description: 'Premium weapon skins and agent unlocks',
    publisher: 'Riot Games',
    itemCount: 189,
    verifiedSellers: 37,
    image: '/valorant.jpg'
  },
  {
    id: 'cod',
    title: 'Call of Duty',
    description: 'Weapon blueprints and operator skins',
    publisher: 'Activision',
    itemCount: 215,
    verifiedSellers: 53,
    image: '/cod.jpg'
  },
  {
    id: 'gta',
    title: 'GTA V',
    description: 'Rare vehicles and property access',
    publisher: 'Rockstar Games',
    itemCount: 176,
    verifiedSellers: 29,
    image: '/gta.jpg'
  },
  {
    id: 'minecraft',
    title: 'Minecraft',
    description: 'Unique worlds and character skins',
    publisher: 'Mojang',
    itemCount: 145,
    verifiedSellers: 32,
    image: '/minecraft.jpg'
  },
  {
    id: 'apex',
    title: 'Apex Legends',
    description: 'Legend skins and weapon cosmetics',
    publisher: 'Respawn Entertainment',
    itemCount: 167,
    verifiedSellers: 43,
    image: '/apex.jpg'
  }
];

// Seller verification badges
const VerificationBadge = ({ level }: { level: 'trusted' | 'verified' | 'elite' }) => {
  const badgeMap = {
    trusted: {
      icon: '✓',
      color: 'var(--success)',
      text: 'Trusted Seller'
    },
    verified: {
      icon: '★',
      color: 'var(--game-gold)',
      text: 'Verified Seller'
    },
    elite: {
      icon: '♦',
      color: 'var(--neon-cyan)',
      text: 'Elite Seller'
    }
  };

  const badge = badgeMap[level];

  return (
    <div 
      className="verified-badge" 
      style={{ 
        color: badge.color, 
        borderColor: `${badge.color}30`
      }}
    >
      <span className="mr-1">{badge.icon}</span>
      <span className="text-xs font-medium">{badge.text}</span>
    </div>
  );
};

// Game card component
const GameCard = ({ game }: { game: any }) => {
  return (
    <div className={`bento-item ${game.featured ? 'bento-item--featured' : ''} ${game.wide ? 'bento-item--wide' : ''}`}>
      <div 
        className="bento-item__background" 
        style={{ 
          backgroundImage: `url(${game.image})` 
        }}
      />
      <div className="bento-item__overlay" />
      <div className="bento-item__content">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-white">{game.title}</h3>
            <VerificationBadge level={game.featured ? 'elite' : 'verified'} />
          </div>
          <p className="text-gray-300">{game.description}</p>
          <div className="text-sm text-gray-400">By {game.publisher}</div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="glass px-3 py-2 rounded-xl">
            <div className="text-sm font-medium text-gradient">{game.itemCount}</div>
            <div className="text-xs text-gray-400">Items</div>
          </div>
          <div className="glass px-3 py-2 rounded-xl">
            <div className="text-sm font-medium text-gradient-gold">{game.verifiedSellers}</div>
            <div className="text-xs text-gray-400">Sellers</div>
          </div>
          <button className="glass-game p-2 rounded-xl hover-lift">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <section id="marketplace" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-animated opacity-10"></div>
      <div className="absolute inset-0 bg-grid-pattern"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="space-y-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div className="space-y-2">
              <div className="inline-flex items-center glass-game px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full pulse-glow mr-3"></div>
                <span className="text-sm font-medium text-purple-300">VERIFIED MARKETPLACE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Legendary <span className="text-gradient">AAA Games</span>
              </h2>
              <p className="text-gray-300 max-w-2xl">
                Browse verified AAA game titles with authenticated sellers. Every transaction is protected by our advanced chain verification system.
              </p>
            </div>
            
            <div>
              <div className="relative glass-dark p-2 rounded-xl">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search legendary items..."
                    className="bg-transparent border-none text-white focus:outline-none py-2 px-4"
                  />
                  <button className="glass-game p-2 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 min-w-max">
              {GAME_CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    activeCategory === category 
                      ? 'glass-game text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Marketplace grid */}
          <div className="bento-grid">
            {FEATURED_GAMES.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          
          {/* Stats and trust indicators */}
          <div className="glass-game p-8 rounded-3xl border border-purple-500/20 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-gradient">1,537</div>
                <div className="text-xl text-gray-300">Verified Items</div>
                <div className="text-sm text-gray-400">Every item authenticated with blockchain verification</div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-gradient-gold">523</div>
                <div className="text-xl text-gray-300">Trusted Sellers</div>
                <div className="text-sm text-gray-400">All sellers verified with KYC and reputation systems</div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-gradient">100%</div>
                <div className="text-xl text-gray-300">Secure Transactions</div>
                <div className="text-sm text-gray-400">Protected by Chainanalysis verification protocols</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
