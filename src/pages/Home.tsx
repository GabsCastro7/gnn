import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Globe, ArrowRight, RefreshCw } from 'lucide-react';
import anime from 'animejs';
import NewsCard from '../components/NewsCard';
import BreakingNews from '../components/BreakingNews';
import TrendingSidebar from '../components/TrendingSidebar';
import RealTimeWidget from '../components/RealTimeWidget';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

import { useNews, useInternationalNews } from '../hooks/useNews';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { news: allNews, loading: allLoading, error: allError, refresh: refreshAll } = useNews({ autoRefresh: true });
  const { news: internationalNews, loading: intLoading, error: intError, refresh: refreshInternational } = useInternationalNews();

  useEffect(() => {
    // Hero animation
    anime({
      targets: '.hero-content',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutQuad'
    });

    // News cards animation
    anime({
      targets: '.news-card',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });

    // Stats animation
    anime({
      targets: '.stat-number',
      innerHTML: [0, (el: any) => el.getAttribute('data-value')],
      duration: 2000,
      round: 1,
      easing: 'easeOutQuad'
    });

    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [allNews, internationalNews]);

  const mainNews = allNews.find(news => news.isMain) || allNews[0];
  const featuredNews = allNews.slice(1, 5);
  const latestNews = allNews.slice(5, 9);

  const handleRefreshAll = async () => {
    await Promise.all([refreshAll(), refreshInternational()]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <BreakingNews />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 dark:text-red-200">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="stat-number text-3xl font-bold" data-value="24">0</div>
                <div className="text-red-200 dark:text-red-300">{t('home.coverage')}</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-3xl font-bold" data-value="150">0</div>
                <div className="text-red-200 dark:text-red-300">{t('home.countries')}</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-3xl font-bold" data-value="1000">0</div>
                <div className="text-red-200 dark:text-red-300">{t('home.news')}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blog"
                className="inline-flex items-center bg-white text-red-600 dark:text-red-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors"
              >
                {t('home.explore')}
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <button
                onClick={handleRefreshAll}
                className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                <RefreshCw size={20} className="mr-2" />
                Atualizar Notícias
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main news section */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {allLoading && (
              <LoadingSpinner 
                size="lg" 
                text="Carregando notícias em tempo real..." 
                className="mb-12"
              />
            )}

            {/* Error State */}
            {allError && (
              <ErrorMessage 
                message={allError} 
                onRetry={refreshAll}
                className="mb-12"
              />
            )}

            {/* Featured article */}
            {!allLoading && !allError && mainNews && (
              <div className="news-card mb-12">
                <NewsCard
                  title={mainNews.title}
                  summary={mainNews.summary}
                  imageUrl={mainNews.imageUrl}
                  category={mainNews.category}
                  timestamp={mainNews.timestamp}
                  isMain={true}
                  id={mainNews.id}
                  url={mainNews.url}
                />
              </div>
            )}

            {/* Real-Time Financial Widget */}
            <div className="news-card mb-12">
              <RealTimeWidget />
            </div>

            {/* Twitter Embed Section */}
            <div className="news-card mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Globe className="mr-2 text-red-600 dark:text-red-500" />
                  Últimas do Oriente Médio
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">CONTEÚDO SENSÍVEL</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    🚨 Cenas Chocantes em Gaza: Exército Israelense Incinera Família Inteira em Ataque Direto com Míssil
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    O exército israelense incinerou uma família inteira em um ataque direto com míssil contra uma sala de aula 
                    lotada de civis deslocados dentro de uma escola ontem.
                  </p>
                </div>
                
                {/* Twitter Embed */}
                <div className="flex justify-center">
                  <blockquote 
                    className="twitter-tweet" 
                    data-media-max-width="560"
                    data-theme="light"
                  >
                    <p lang="en" dir="ltr">
                      ⚠️Sensitive Content ⚠️<br/><br/>
                      🚨Horrific scenes in Gaza : The Israeli army incinerated an entire family in a direct missile strike on a classroom packed with displaced civilians inside a school yesterday. 
                      <a href="https://t.co/7gBcB1Gj6H">pic.twitter.com/7gBcB1Gj6H</a>
                    </p>
                    &mdash; Gaza Notifications (@gazanotice) 
                    <a href="https://twitter.com/gazanotice/status/1938922253854392650?ref_src=twsrc%5Etfw">
                      June 28, 2025
                    </a>
                  </blockquote>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Aviso:</strong> Este conteúdo contém imagens e relatos que podem ser perturbadores. 
                    A Global News Network compartilha esta informação para fins jornalísticos e de conscientização sobre a situação humanitária.
                  </p>
                </div>
              </div>
            </div>

            {/* Featured News Grid */}
            {!allLoading && !allError && featuredNews.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Globe className="mr-2 text-red-600 dark:text-red-500" />
                  {t('home.highlights')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredNews.map((news, index) => (
                    <div key={news.id} className="news-card">
                      <NewsCard
                        title={news.title}
                        summary={news.summary}
                        imageUrl={news.imageUrl}
                        category={news.category}
                        timestamp={news.timestamp}
                        id={news.id}
                        url={news.url}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest News */}
            {!allLoading && !allError && latestNews.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Clock className="mr-2 text-red-600 dark:text-red-500" />
                  {t('home.latest')}
                </h2>
                <div className="space-y-6">
                  {latestNews.map((news, index) => (
                    <div key={news.id} className="news-card">
                      <Link to={news.url?.startsWith('/promo/') ? news.url : `/blog/${news.id}`} className="block group">
                        <div className="flex flex-col md:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-200">
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full md:w-48 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="flex-1">
                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded mb-2 ${
                              news.title.includes('Magalu') 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            }`}>
                              {news.title.includes('Magalu') ? 'PROMOÇÃO' : news.category}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                              {news.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{news.summary}</p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                              <Clock size={14} className="mr-1" />
                              {news.timestamp}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Load more button */}
            {!allLoading && !allError && allNews.length > 0 && (
              <div className="text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center bg-red-600 dark:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                >
                  {t('home.viewAll')}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrendingSidebar />
          </div>
        </div>
      </main>

      {/* Live Update Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium">Dados em Tempo Real</span>
        </div>
      </div>
    </div>
  );
};

export default Home;