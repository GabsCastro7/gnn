// Clean and minimal Header component without ads or Armageddon clock
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Crown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { usePaywall } from '../contexts/PaywallContext';

const CleanHeader: React.FC = () => {
  const { t } = useLanguage();
  const { isSubscribed, setShowPaywall } = usePaywall();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { name: t('header.home'), path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: t('header.about'), path: '/about' },
    { name: t('header.contact'), path: '/contact' }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/20250622_2016_Logo_GNN_Icônico_simple_compose_01jycytrjmekysntqhf8em8g8f-removebg-preview.png" alt="Logo" className="h-12 w-auto mr-2" />
          <span className="font-bold text-lg">GNN</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex space-x-6">
          {menuItems.map(({ name, path }) => (
            <Link key={path} to={path} className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-medium">
              {name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600">
            <Search size={20} />
          </button>

          <LanguageSelector />
          <ThemeToggle />

          {isSubscribed ? (
            <span className="flex items-center bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
              <Crown size={14} className="mr-1" /> Premium
            </span>
          ) : (
            <button onClick={() => setShowPaywall(true)} className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-700">
              Assinar
            </button>
          )}

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 text-gray-600 dark:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="bg-gray-50 dark:bg-gray-900 py-2">
          <div className="max-w-7xl mx-auto px-4">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('header.search')}
              className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          {menuItems.map(({ name, path }) => (
            <Link key={path} to={path} onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-red-600">
              {name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default CleanHeader;
