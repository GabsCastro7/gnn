import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Eye, ArrowRight, RefreshCw } from 'lucide-react';
import anime from 'animejs';
import { useNews, useInternationalNews } from '../hooks/useNews';
import LoadingSpinner from './LoadingSpinner';

const TrendingSidebar: React.FC = () => {
  const { news: trendingNews, loading: trendingLoading, refresh: refreshTrending } = useNews({ autoRefresh: true });
  const { news: internationalNews, loading: intLoading } = useInternationalNews();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.sidebar-section',
            translateX: [30, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(200),
            easing: 'easeOutQuad'
          });
        }
      });
    });

    const sidebarElement = document.querySelector('.sidebar-container');
    if (sidebarElement) {
      observer.observe(sidebarElement);
    }

    return () => observer.disconnect();
  }, []);

  const topTrending = trendingNews.slice(0, 4);
  const mostRead = trendingNews.slice(4, 9);
  const liveUpdates = internationalNews.slice(0, 4);

  return (
    <aside className="space-y-8 sidebar-container">
      {/* Trending News */}
      <div className="sidebar-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
            <TrendingUp className="mr-2 text-red-600" size={24} />
            Em Alta
          </h3>
          <button
            onClick={refreshTrending}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Atualizar"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        
        {trendingLoading ? (
          <LoadingSpinner size="sm" text="Carregando..." />
        ) : (
          <div className="space-y-4">
            {topTrending.map((news, index) => {
              // Check if this is the Magalu promo and redirect accordingly
              const linkTo = news.title.includes('Magalu') && news.title.includes('Projetor Samsung') 
                ? '/promo/magalu-projetor-samsung' 
                : `/blog/${news.id}`;
              
              return (
                <Link
                  key={news.id}
                  to={linkTo}
                  className="group cursor-pointer pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 block"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-2 leading-snug">
                    {news.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      news.title.includes('Magalu') 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {news.title.includes('Magalu') ? 'PROMOÇÃO' : news.category}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Eye size={12} className="mr-1" />
                        {news.views || 0}
                      </span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {news.timestamp}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        
        <Link
          to="/blog"
          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mt-4 transition-colors"
        >
          Ver mais notícias
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      {/* Most Read */}
      <div className="sidebar-section bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Mais Lidas da Semana
        </h3>
        <ol className="space-y-3">
          {mostRead.map((article, index) => {
            // Check if this is the Magalu promo and redirect accordingly
            const linkTo = article.title.includes('Magalu') && article.title.includes('Projetor Samsung') 
              ? '/promo/magalu-projetor-samsung' 
              : `/blog/${article.id}`;
            
            return (
              <li key={article.id} className="flex items-start group cursor-pointer">
                <span className="bg-red-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-red-700 transition-colors">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <Link
                    to={linkTo}
                    className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors font-medium leading-snug block"
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mt-1">
                    <Eye size={10} className="mr-1" />
                    {article.views || 0} visualizações
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Live Updates */}
      <div className="sidebar-section bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-6 flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          Atualizações ao Vivo
        </h3>
        
        {intLoading ? (
          <LoadingSpinner size="sm" text="Carregando..." />
        ) : (
          <div className="space-y-3">
            {liveUpdates.map((update, index) => {
              // Check if this is the Magalu promo and redirect accordingly
              const linkTo = update.title.includes('Magalu') && update.title.includes('Projetor Samsung') 
                ? '/promo/magalu-projetor-samsung' 
                : `/blog/${update.id}`;
              
              return (
                <Link
                  key={update.id}
                  to={linkTo}
                  className="flex items-start hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded transition-colors"
                >
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mr-3 flex-shrink-0">
                    {update.timestamp.split(' ')[1] || 'AGORA'}
                  </span>
                  <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                    {update.title}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="sidebar-section bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">
          Newsletter GNN
        </h3>
        <p className="text-red-100 mb-4 text-sm">
          Receba as principais notícias internacionais diretamente no seu email.
        </p>
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          alert('Funcionalidade de newsletter será implementada em breve!');
        }}>
          <input
            type="email"
            placeholder="Seu email"
            required
            className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <button
            type="submit"
            className="w-full bg-white text-red-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Inscrever-se
          </button>
        </form>
      </div>
    </aside>
  );
};

export default TrendingSidebar;