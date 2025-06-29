import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, Bell, User, Crown } from 'lucide-react';
import anime from 'animejs';
import { useLanguage } from '../contexts/LanguageContext';
import { usePaywall } from '../contexts/PaywallContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isSubscribed, setShowPaywall } = usePaywall();

  const menuItems = [
    { name: t('header.home'), path: '/' },
    { name: t('header.international'), path: '/category/internacional' },
    { name: t('header.politics'), path: '/category/politica' },
    { name: t('header.economy'), path: '/category/economia' },
    { name: t('header.technology'), path: '/category/tecnologia' },
    { name: t('header.blog'), path: '/blog' },
    { name: t('header.suggest'), path: '/suggest-news' },
    
    { name: t('header.about'), path: '/about' },
    { name: t('header.contact'), path: '/contact' }
  ];

  useEffect(() => {
    // Animate logo on load
    anime({
      targets: '.logo-animation',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutElastic(1, .8)'
    });

    // Animate menu items
    anime({
      targets: '.menu-item',
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      anime({
        targets: '.mobile-menu',
        translateX: [-300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
  };

  return (
    <>
      {/* Top Ad Banner */}
      <div className="hidden md:block bg-gray-100 dark:bg-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
        </div>
      </div>

      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-200">
        {/* Breaking News Bar */}
        <div className="bg-red-600 dark:bg-red-700 text-white py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center">
              <span className="bg-white text-red-600 dark:text-red-700 px-3 py-1 text-xs font-bold rounded mr-4 flex items-center">
                <Bell size={12} className="mr-1" />
                {t('header.live')}
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-sm font-medium">
                    🌍 Últimas notícias internacionais • Tensões diplomáticas no Oriente Médio • Economia global em foco • Tecnologia e inovação
                  </span>
                </div>
              </div>
            </div>
          </div>
</div>

{/* Top Ad Banner */}
<div className="bg-gray-100 dark:bg-gray-800 py-2">
  <div className="max-w-7xl mx-auto px-4 flex justify-center">
    
  </div>
</div>

{/* Main Header */}
<div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center logo-animation">
              <img 
                src="/20250622_2016_Logo GNN Icônico_simple_compose_01jycytrjmekysntqhf8em8g8f copy.png" 
                alt="Global News Network Logo" 
                className="h-12 w-auto mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Global News Network
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Jornalismo Internacional</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.slice(0, 8).map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="menu-item text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-all duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 dark:bg-red-500 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}


            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Search size={20} />
              </button>
              
              <div className="hidden md:flex items-center space-x-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>

              {isSubscribed ? (
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  <Crown size={16} className="mr-1" />
                  <span className="hidden md:inline">Premium</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowPaywall(true)}
                  className="flex items-center bg-red-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                >
                  Assinar
                </button>

              
              <button className="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <User size={20} />
              </button>
              
              <button 
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  placeholder={t('header.search')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}
        </div>


>

                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  {item.name}
                </Link>
              ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold justify-center">
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 mobile-menu">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {item.name}
              </Link>
            ))}
            {isSubscribed && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold justify-center">
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <LanguageSelector />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  </>
);

export default Header;
