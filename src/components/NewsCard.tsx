import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ExternalLink, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NewsCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  timestamp: string;
  isMain?: boolean;
  id?: number;
  url?: string;
  source?: string;
  views?: number;
  content?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  title, 
  summary, 
  imageUrl, 
  category, 
  timestamp, 
  isMain = false,
  id = 1,
  url,
  source,
  views,
  content
}) => {
  const { t } = useLanguage();

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (url && url !== '#') {
      if (url.startsWith('/promo/')) {
        // Navigate to internal promo page
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Check if this is the Magalu promo
  const isMagaluPromo = title.includes('Magalu') && title.includes('Projetor Samsung');

  // Fallback images for different categories
  const getFallbackImage = (category: string): string => {
    const fallbackImages: Record<string, string> = {
      'INTERNACIONAL': 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      'POLÍTICA': 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      'ECONOMIA': 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
      'TECNOLOGIA': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      'SAÚDE': 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800',
      'ESPORTES': 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800',
      'MEIO AMBIENTE': 'https://images.pexels.com/photos/3621160/pexels-photo-3621160.jpeg?auto=compress&cs=tinysrgb&w=800',
      'CIÊNCIA': 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=800',
      'CULTURA': 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800',
      'GERAL': 'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    
    return fallbackImages[category.toUpperCase()] || fallbackImages['GERAL'];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallback = getFallbackImage(category);
    
    // Prevent infinite loop if fallback also fails
    if (target.src !== fallback) {
      target.src = fallback;
    }
  };

  return (
    <Link to={url?.startsWith('/promo/') ? url : `/blog/${id}`} className="block group">
      <article className={`cursor-pointer ${isMain ? 'mb-8' : 'mb-6'}`}>
        <div className="flex flex-col space-y-3">
          {/* Image */}
          <div className={`relative overflow-hidden rounded-lg ${isMain ? 'h-64 md:h-80' : 'h-48'}`}>
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 text-sm font-semibold rounded ${
                isMagaluPromo 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 dark:bg-red-700 text-white'
              }`}>
                {isMagaluPromo ? 'PROMOÇÃO' : category}
              </span>
            </div>
            
            {/* Special badge for Magalu promo */}
            {isMagaluPromo && (
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-bold rounded-full flex items-center">
                  <ShoppingCart size={12} className="mr-1" />
                  50% OFF
                </span>
              </div>
            )}
            
            {/* External Link Button */}
            {url && url !== '#' && !url.startsWith('/promo/') && (
              <button
                onClick={handleExternalLink}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                title="Abrir fonte original"
              >
                <ExternalLink size={16} />
              </button>
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h2 className={`font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors leading-tight ${
              isMain ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
            }`}>
              {title}
            </h2>
            
            <p className={`text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 ${
              isMain ? 'text-lg' : 'text-base'
            }`} 
            dangerouslySetInnerHTML={{ __html: content || summary }} />
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{timestamp}</span>
                </div>
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  <span>{views || Math.floor(Math.random() * 1000) + 100} {t('common.views')}</span>
                </div>
              </div>
              {isMagaluPromo && (
                <span className="text-green-600 font-semibold text-xs">
                  OFERTA LIMITADA →
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;