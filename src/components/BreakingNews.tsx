import React, { useEffect } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import anime from 'animejs';
import { useBreakingNews } from '../hooks/useNews';

const BreakingNews: React.FC = () => {
  const { news: breakingNews, loading, error } = useBreakingNews();

  useEffect(() => {
    anime({
      targets: '.breaking-badge',
      scale: [0.8, 1.1, 1],
      duration: 1000,
      easing: 'easeOutElastic(1, .8)',
      loop: true,
      direction: 'alternate'
    });
  }, []);

  if (loading || error || breakingNews.length === 0) {
    return (
      <div className="bg-red-600 text-white py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <div className="flex items-center mr-4 breaking-badge">
              <span className="bg-white text-red-600 px-3 py-1 text-sm font-bold rounded flex items-center">
                <Bell size={12} className="mr-1 animate-pulse" />
                AO VIVO
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-lg font-medium">
                  {loading ? 'Carregando notícias urgentes...' : 
                   error ? 'Erro ao carregar notícias urgentes' :
                   '🌍 Acompanhe as últimas notícias em tempo real • Cobertura 24/7 dos principais acontecimentos'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-600 text-white py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center mr-4 breaking-badge">
            <span className="bg-white text-red-600 px-3 py-1 text-sm font-bold rounded flex items-center">
              <Bell size={12} className="mr-1 animate-pulse" />
              AO VIVO
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {breakingNews.map((news, index) => (
                <span key={news.id} className="text-lg font-medium mr-12">
                  🚨 {news.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;