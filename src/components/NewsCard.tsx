import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ExternalLink } from 'lucide-react';
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
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMagaluPromo = () => {
    // Implementation for Magalu promotion tracking
    console.log('Magalu promotion button clicked');
    // Add conversion tracking logic here
    // Example: sendEventToAnalytics('magalu_promo_click');
    // Redirect to Magalu's website
    window.open('https://www.magalu.com.br', '_blank', 'noopener,noreferrer');
  };

  return (
    <Link to={`/blog/${id}`} className="block group">
      <article className={`cursor-pointer ${isMain ? 'mb-8' : 'mb-6'}`}>
        <div className="flex flex-col space-y-3">
          {/* Image */}
          <div className={`relative overflow-hidden rounded-lg ${isMain ? 'h-64 md:h-80' : 'h-48'}`}>
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 dark:bg-red-700 text-white px-3 py-1 text-sm font-semibold rounded">
                {category}
              </span>
            </div>
            
            {/* External Link Button */}
            {url && url !== '#' && (
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
            
<p className={`text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 ${isMain ? 'text-lg' : 'text-base'} text-red-600 dark:text-red-700`} dangerouslySetInnerHTML={{ __html: content || summary }} />
            
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
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
