import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.footer-section',
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(200),
            easing: 'easeOutQuad'
          });
        }
      });
    });

    const footerElement = document.querySelector('.footer-container');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  const footerSections = [
    {
      title: "Global News Network",
      links: [
        { name: t('footer.about'), path: "/about" },
        { name: t('footer.team'), path: "/about#team" },
        { name: t('footer.mission'), path: "/about#mission" },
        { name: t('footer.privacy'), path: "/privacy" },
        { name: t('footer.terms'), path: "/terms" }
      ]
    },
    {
      title: t('footer.sections'),
      links: [
        { name: t('header.international'), path: "/category/internacional" },
        { name: t('header.politics'), path: "/category/politica" },
        { name: t('header.economy'), path: "/category/economia" },
        { name: t('header.technology'), path: "/category/tecnologia" },
        { name: t('header.blog'), path: "/blog" }
      ]
    },
    {
      title: t('footer.services'),
      links: [
        { name: t('footer.newsletter'), path: "/newsletter" },
        { name: t('header.suggest'), path: "/suggest-news" }
      ]
    },
    {
      title: t('footer.contact'),
      links: [
        { name: t('header.contact'), path: "/contact" },
        { name: t('footer.newsroom'), path: "/contact#newsroom" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white footer-container transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h3 className="text-lg font-bold mb-4 text-red-400 dark:text-red-500">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path}
                      className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo and Description */}
        <div className="border-t border-gray-700 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 footer-section">
              <div className="flex items-center mb-4">
                <img 
                  src="/20250622_2016_Logo GNN Icônico_simple_compose_01jycytrjmekysntqhf8em8g8f copy.png" 
                  alt="Global News Network Logo" 
                  className="h-10 w-auto mr-3"
                />
                <div>
                  <h2 className="text-2xl font-bold text-red-400 dark:text-red-500">
                    Global News Network
                  </h2>
                  <p className="text-gray-300 dark:text-gray-400 text-sm">Jornalismo Internacional</p>
                </div>
              </div>
              <p className="text-gray-300 dark:text-gray-400 max-w-md">
                {t('footer.description')}
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="footer-section">
              <h3 className="text-lg font-bold mb-4 text-red-400 dark:text-red-500">
                {t('footer.newsletter')}
              </h3>
              <p className="text-gray-300 dark:text-gray-400 text-sm mb-4">
                Receba as principais notícias no seu email
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-900 border border-gray-600 dark:border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Inscrever
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-700 dark:border-gray-800 text-center text-gray-400 dark:text-gray-500 footer-section">
            <p>{t('footer.copyright')}</p>
            <p className="mt-2 text-sm">
              {t('footer.powered')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;