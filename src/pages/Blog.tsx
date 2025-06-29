import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Tag, Eye, RefreshCw, Loader2 } from 'lucide-react';
import anime from 'animejs';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdBanner from '../components/monetization/AdBanner';
import NativeAd from '../components/monetization/NativeAd';
import MonetizationManager from '../components/monetization/MonetizationManager';
import { useNews } from '../hooks/useNews';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { news, loading, error, refresh, loadMore, hasMore } = useNews({ 
    category: selectedCategory,
    query: searchTerm,
    autoRefresh: true,
    refreshInterval: 10 * 60 * 1000, // 10 minutos
    pageSize: 12
  });

  const { isFetching, lastElementRef } = useInfiniteScroll(
    loadMore,
    { enabled: hasMore && !loading }
  );

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'internacional', label: 'Internacional' },
    { value: 'politica', label: 'Política' },
    { value: 'economia', label: 'Economia' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'saude', label: 'Saúde' }
  ];

  useEffect(() => {
    anime({
      targets: '.blog-header',
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad'
    });

    anime({
      targets: '.blog-card',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });
  }, [news]);

  // Filter and sort news
  const filteredNews = news
    .filter(newsItem => {
      const matchesSearch = searchTerm === '' || 
        newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsItem.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
        newsItem.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      return 0;
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Detectar se é mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="blog-header text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Blog <span className="text-red-600 dark:text-red-500">Global News Network</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
              Acompanhe as últimas notícias em tempo real dos principais acontecimentos mundiais
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Atualização automática ativa
            </div>
          </div>
        </div>
      </div>

      {/* Top Ad Banner */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="728x90" position="header" className="mx-auto" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </form>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-1 md:flex-none">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 flex-1 md:flex-none">
                <Calendar size={20} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="oldest">Mais Antigas</option>
                  <option value="popular">Mais Populares</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={refresh}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <RefreshCw size={16} />
                {!isMobile && 'Atualizar'}
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredNews.length} notícias
            {searchTerm && ` para "${searchTerm}"`}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && filteredNews.length === 0 && (
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

        {!loading && !error && filteredNews.length > 0 && (
          <>
            <div className={`grid gap-6 mb-8 ${
              isMobile 
                ? 'grid-cols-1' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {filteredNews.map((newsItem, index) => {
                const isLast = index === filteredNews.length - 1;
                return (
                  <div key={newsItem.id}>
                    {/* Insert ads every 6 articles */}
                    {index > 0 && index % 6 === 0 && (
                      <div className="mb-6 col-span-full">
                        <AdBanner size="728x90" position="content" className="mx-auto" />
                      </div>
                    )}
                    
                    {/* Insert native ads every 8 articles */}
                    {index > 0 && index % 8 === 0 && (
                      <div className="mb-6 col-span-full">
                        <NativeAd style="article" className="mx-auto max-w-md" />
                      </div>
                    )}
                    
                    <div 
                      className="blog-card"
                      ref={isLast ? lastElementRef : null}
                    >
                      <Link to={`/blog/${newsItem.id}`} className="block group">
                        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                          <div className="relative">
                            <img
                              src={newsItem.imageUrl}
                              alt={newsItem.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              loading={index < 4 ? 'eager' : 'lazy'}
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">
                                {newsItem.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2">
                              {newsItem.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                              {newsItem.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                              <div className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                {newsItem.timestamp}
                              </div>
                              <div className="flex items-center">
                                <Eye size={12} className="mr-1" />
                                {newsItem.views || 0}
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

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
            {!hasMore && filteredNews.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                  <span>Você viu todas as notícias disponíveis</span>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}
      </main>

      {/* Monetization Manager */}
      <MonetizationManager page="blog" category={selectedCategory} />

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

export default Blog;