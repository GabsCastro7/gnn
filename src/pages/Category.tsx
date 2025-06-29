import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Filter, Grid, List, RefreshCw, Loader2, Check } from 'lucide-react';
import anime from 'animejs';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useNews } from '../hooks/useNews';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const { news, loading, error, refresh, loadMore, hasMore } = useNews({ 
    category: category || 'all',
    autoRefresh: true,
    pageSize: 12
  });

  const { isFetching, lastElementRef } = useInfiniteScroll(
    loadMore,
    { enabled: hasMore && !loading }
  );

  const categoryNames: { [key: string]: string } = {
    'internacional': 'INTERNACIONAL',
    'politica': 'POLÍTICA',
    'economia': 'ECONOMIA',
    'tecnologia': 'TECNOLOGIA',
    'esportes': 'ESPORTES',
    'saude': 'SAÚDE',
    'ciencia': 'CIÊNCIA',
    'entretenimento': 'ENTRETENIMENTO'
  };

  const categoryName = categoryNames[category || ''] || category?.toUpperCase() || 'CATEGORIA';
  
  const sortedNews = [...news].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
    return 0;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    anime({
      targets: '.category-header',
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad'
    });

    anime({
      targets: '.news-item',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });
  }, [category, viewMode, news]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'INTERNACIONAL': return 'from-blue-600 to-blue-700';
      case 'POLÍTICA': return 'from-purple-600 to-purple-700';
      case 'ECONOMIA': return 'from-green-600 to-green-700';
      case 'TECNOLOGIA': return 'from-indigo-600 to-indigo-700';
      case 'ESPORTES': return 'from-orange-600 to-orange-700';
      case 'SAÚDE': return 'from-pink-600 to-pink-700';
      default: return 'from-red-600 to-red-700';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'INTERNACIONAL': return '🌍';
      case 'POLÍTICA': return '🏛️';
      case 'ECONOMIA': return '💼';
      case 'TECNOLOGIA': return '💻';
      case 'ESPORTES': return '⚽';
      case 'SAÚDE': return '🏥';
      default: return '📰';
    }
  };

  // Detectar se é mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar ao Início
          </Link>
        </div>
      </div>

      {/* Category Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor(categoryName)} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="category-header text-center">
            <div className="text-6xl mb-4">{getCategoryIcon(categoryName)}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {categoryName}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
              Acompanhe as últimas notícias sobre {categoryName.toLowerCase()} em tempo real
            </p>
            <div className="flex items-center justify-center text-white/80">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              {loading ? 'Carregando...' : `${sortedNews.length} notícias encontradas`}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="oldest">Mais Antigas</option>
                  <option value="popular">Mais Populares</option>
                </select>
              </div>
              
              <button
                onClick={refresh}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw size={16} />
                {!isMobile && 'Atualizar'}
              </button>
            </div>

            {!isMobile && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* News Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && sortedNews.length === 0 && (
          <LoadingSpinner 
            size="lg" 
            text="Carregando notícias em tempo real..." 
          />
        )}

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={refresh}
          />
        )}

        {!loading && !error && sortedNews.length > 0 && (
          <>
            {/* Force grid view on mobile */}
            {(viewMode === 'grid' || isMobile) ? (
              <div className={`grid gap-6 mb-8 ${
                isMobile 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {sortedNews.map((news, index) => {
                  const isLast = index === sortedNews.length - 1;
                  return (
                    <div 
                      key={news.id} 
                      className="news-item"
                      ref={isLast ? lastElementRef : null}
                    >
                      <Link to={`/blog/${news.id}`} className="block group">
                        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                          <div className="relative">
                            <img
                              src={news.imageUrl}
                              alt={news.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              loading={index < 4 ? 'eager' : 'lazy'}
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">
                                {news.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2">
                              {news.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                              {news.summary}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {news.timestamp}
                              </div>
                              <div className="flex items-center">
                                <Eye size={14} className="mr-1" />
                                {news.views || 0}
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {sortedNews.map((news, index) => {
                  const isLast = index === sortedNews.length - 1;
                  return (
                    <div 
                      key={news.id} 
                      className="news-item"
                      ref={isLast ? lastElementRef : null}
                    >
                      <Link to={`/blog/${news.id}`} className="block group">
                        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                          <div className="flex flex-col md:flex-row gap-6">
                            <img
                              src={news.imageUrl}
                              alt={news.title}
                              className="w-full md:w-48 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              loading={index < 4 ? 'eager' : 'lazy'}
                            />
                            <div className="flex-1">
                              <div className="mb-2">
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 text-sm font-semibold rounded">
                                  {news.category}
                                </span>
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                                {news.title}
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {news.summary}
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {news.timestamp}
                                  </div>
                                  <div className="flex items-center">
                                    <Eye size={14} className="mr-1" />
                                    {news.views || 0}
                                  </div>
                                </div>
                                <span className="text-red-600 dark:text-red-400 font-medium group-hover:underline">
                                  Ler mais →
                                </span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Loading indicator for infinite scroll */}
            {isFetching && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Carregando mais notícias...</span>
                </div>
              </div>
            )}

            {/* End of content indicator */}
            {!hasMore && sortedNews.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                  <Check className="w-5 h-5" />
                  <span>Você viu todas as notícias disponíveis</span>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && sortedNews.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              Nenhuma notícia encontrada
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-8">
              Não há notícias disponíveis nesta categoria no momento.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={refresh}
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw size={20} className="mr-2" />
                Tentar Novamente
              </button>
              <Link
                to="/"
                className="inline-flex items-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Mobile scroll indicator */}
      {isMobile && hasMore && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <span>Role para ver mais</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;