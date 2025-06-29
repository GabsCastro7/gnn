import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Calendar, Eye, Filter, ArrowLeft, RefreshCw, Loader2, Check } from 'lucide-react';
import anime from 'animejs';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useNews } from '../hooks/useNews';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const { news, loading, error, refresh, loadMore, hasMore } = useNews({ 
    query: searchTerm,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    pageSize: 12
  });

  const { isFetching, lastElementRef } = useInfiniteScroll(
    loadMore,
    { enabled: hasMore && !loading }
  );

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    anime({
      targets: '.search-header',
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad'
    });

    anime({
      targets: '.search-result',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });
  }, [news]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
    }
  };

  const sortedResults = [...news].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
    return 0; // relevance - could implement more sophisticated scoring
  });

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{part}</mark> : part
    );
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

      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="search-header">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {query ? `Resultados para "${query}"` : 'Buscar Notícias'}
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-2xl">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite sua busca..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2 flex-1 md:flex-none">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="internacional">Internacional</option>
                  <option value="politica">Política</option>
                  <option value="economia">Economia</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="esportes">Esportes</option>
                  <option value="saude">Saúde</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="newest">Mais Recentes</option>
                <option value="oldest">Mais Antigas</option>
                <option value="popular">Mais Populares</option>
              </select>

              <button
                onClick={refresh}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <RefreshCw size={16} />
                {!isMobile && 'Atualizar'}
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-gray-600 dark:text-gray-400">
              {loading ? 'Buscando...' : 
               `${sortedResults.length} resultado${sortedResults.length !== 1 ? 's' : ''} encontrado${sortedResults.length !== 1 ? 's' : ''}`}
              {searchTerm && ` para "${searchTerm}"`}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && sortedResults.length === 0 && (
          <LoadingSpinner 
            size="lg" 
            text="Buscando notícias em tempo real..." 
          />
        )}

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={refresh}
          />
        )}

        {!loading && !error && sortedResults.length > 0 && (
          <>
            <div className="space-y-6 mb-8">
              {sortedResults.map((news, index) => {
                const isLast = index === sortedResults.length - 1;
                return (
                  <div 
                    key={news.id} 
                    className="search-result"
                    ref={isLast ? lastElementRef : null}
                  >
                    <Link to={`/blog/${news.id}`} className="block group">
                      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                        <div className={`flex gap-6 ${isMobile ? 'flex-col' : 'flex-col md:flex-row'}`}>
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className={`object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 ${
                              isMobile ? 'w-full h-48' : 'w-full md:w-48 h-32'
                            }`}
                            loading={index < 4 ? 'eager' : 'lazy'}
                          />
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 text-sm font-semibold rounded">
                                {news.category}
                              </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                              {highlightText(news.title, searchTerm)}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {highlightText(news.summary, searchTerm)}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <Calendar size={14} className="mr-1" />
                                  {news.timestamp}
                                </div>
                                <div className="flex items-center">
                                  <Eye size={14} className="mr-1" />
                                  {news.views || 0} views
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

            {/* Loading indicator for infinite scroll */}
            {isFetching && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Carregando mais resultados...</span>
                </div>
              </div>
            )}

            {/* End of content indicator */}
            {!hasMore && sortedResults.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                  <Check className="w-5 h-5" />
                  <span>Você viu todos os resultados</span>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && sortedResults.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Digite algo para buscar'}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-8">
              {searchTerm 
                ? 'Tente usar palavras-chave diferentes ou remover alguns filtros.'
                : 'Use a barra de busca acima para encontrar notícias específicas.'
              }
            </p>
            {searchTerm && (
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400 font-medium">Sugestões:</p>
                <ul className="text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Verifique a ortografia das palavras</li>
                  <li>• Use termos mais gerais</li>
                  <li>• Tente palavras-chave diferentes</li>
                  <li>• Remova filtros de categoria</li>
                </ul>
              </div>
            )}
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

export default Search;