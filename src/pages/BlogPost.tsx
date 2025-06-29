import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Share2, Bookmark, Eye, ArrowLeft, Tag, Facebook, Twitter, Linkedin, Copy, Check, Lock } from 'lucide-react';
import anime from 'animejs';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PaywallTrigger from '../components/PaywallTrigger';
import { useNews } from '../hooks/useNews';
import { usePaywall } from '../contexts/PaywallContext';

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const postId = parseInt(slug || '1');
  const { news, loading, error } = useNews();
  const { isSubscribed, setShowPaywall } = usePaywall();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPaywall, setShowPaywallContent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const post = news.find(item => item.id === postId) || news[0];
  const relatedPosts = news.filter(item => item.id !== postId && item.category === post?.category).slice(0, 3);

  // Check if this is the Magalu promo (should be free)
  const isMagaluPromo = post?.id === 999999 || post?.title.includes('Magalu');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    anime({
      targets: '.post-header',
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad'
    });

    anime({
      targets: '.post-content',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 200,
      easing: 'easeOutQuad'
    });

    anime({
      targets: '.related-post',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100, {start: 400}),
      easing: 'easeOutQuad'
    });

    // Scroll tracking for paywall
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);

      // Show paywall at 50% scroll for non-subscribers (except Magalu promo)
      if (!isSubscribed && !isMagaluPromo && scrollPercent > 50 && !showPaywall) {
        setShowPaywallContent(true);
        setShowPaywall(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [postId, isSubscribed, isMagaluPromo, showPaywall]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        });
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Carregando notícia..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ErrorMessage message={error || "Notícia não encontrada"} />
      </div>
    );
  }

  // Gerar conteúdo completo da notícia
  const generateFullContent = (post: any) => {
    const baseContent = post.content || post.summary;
    
    const fullContent = `
      <div class="article-intro">
        <p class="lead">${post.summary}</p>
      </div>

      <div class="article-body">
        <h2>Contexto da Notícia</h2>
        <p>${baseContent}</p>
        
        <p>Esta notícia representa um desenvolvimento significativo no cenário atual de ${post.category.toLowerCase()}. Os especialistas acompanham de perto os desdobramentos e possíveis impactos desta situação.</p>

        <h2>Análise Detalhada</h2>
        <p>Segundo fontes especializadas, os eventos descritos nesta reportagem têm implicações que vão além do escopo imediato, podendo influenciar decisões futuras em diversos setores relacionados.</p>

        <h3>Principais Pontos:</h3>
        <ul>
          <li>Análise detalhada dos acontecimentos reportados</li>
          <li>Impacto nas relações e dinâmicas do setor</li>
          <li>Perspectivas e projeções para desenvolvimentos futuros</li>
          <li>Reações de especialistas e autoridades competentes</li>
        </ul>

        <p>A situação continua em desenvolvimento, e nossa equipe de jornalistas acompanha de perto todos os desdobramentos para manter nossos leitores informados com as informações mais atualizadas e precisas.</p>

        <h2>Repercussão</h2>
        <p>A notícia tem gerado discussões importantes entre especialistas e autoridades do setor. As implicações deste desenvolvimento são consideradas significativas para o cenário atual.</p>

        <p>Nossa redação continuará acompanhando esta história e fornecerá atualizações conforme novas informações estiverem disponíveis. Para mais notícias sobre ${post.category.toLowerCase()}, continue acompanhando o Global News Network.</p>
      </div>
    `;

    // Para não assinantes, mostrar apenas metade do conteúdo (exceto Magalu)
    if (!isSubscribed && !isMagaluPromo) {
      const previewContent = `
        <div class="article-intro">
          <p class="lead">${post.summary}</p>
        </div>

        <div class="article-body">
          <h2>Contexto da Notícia</h2>
          <p>${baseContent}</p>
          
          <p>Esta notícia representa um desenvolvimento significativo no cenário atual de ${post.category.toLowerCase()}. Os especialistas acompanham de perto os desdobramentos...</p>
          
          <h2>Análise Detalhada</h2>
          <p>Segundo fontes especializadas, os eventos descritos nesta reportagem têm implicações que vão além do escopo imediato...</p>
        </div>
      `;
      return previewContent;
    }

    return fullContent;
  };

  const contentToShow = generateFullContent(post);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div 
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para o Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="post-header mb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
              isMagaluPromo 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 dark:bg-red-700 text-white'
            }`}>
              {isMagaluPromo ? 'PROMOÇÃO ESPECIAL' : post.category}
            </span>
            {!isSubscribed && !isMagaluPromo && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-semibold rounded-full">
                CONTEÚDO PREMIUM
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center">
              <User size={18} className="mr-2" />
              <span>{post.author || 'Redação Global News Network'}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <span>{post.timestamp}</span>
            </div>
            <div className="flex items-center">
              <Eye size={18} className="mr-2" />
              <span>{post.views || Math.floor(Math.random() * 5000) + 1000} visualizações</span>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 size={18} />
                Compartilhar
              </button>
              
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-white"
                  >
                    <Facebook size={16} className="text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-white"
                  >
                    <Twitter size={16} className="text-blue-400" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-white"
                  >
                    <Linkedin size={16} className="text-blue-700" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-white"
                  >
                    {copySuccess ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copySuccess ? 'Copiado!' : 'Copiar Link'}
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                isBookmarked 
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
              {isBookmarked ? 'Salvo' : 'Salvar'}
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="post-content mb-8">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
        </div>

        {/* Article Content */}
        <div className="post-content relative">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: contentToShow }}
              style={{
                lineHeight: '1.7',
                fontSize: '18px'
              }}
            />
            
            {/* Paywall Overlay - Only for non-subscribers and non-Magalu content */}
            {!isSubscribed && !isMagaluPromo && showPaywall && (
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-gray-800 dark:via-gray-800/90 dark:to-transparent rounded-lg">
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 text-center shadow-lg">
                    <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="text-red-600 dark:text-red-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Continue Lendo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Você leu 50% desta notícia. Assine para ter acesso completo a todo nosso conteúdo premium
                    </p>
                    <button
                      onClick={() => setShowPaywall(true)}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Assinar por R$ 29,90/mês
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Cancele a qualquer momento • Acesso ilimitado
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags - Show for all content */}
        {(isSubscribed || isMagaluPromo) && (
          <div className="mt-8 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[post.category, 'Notícias', 'Jornalismo', 'Atualidades'].map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts - Show for all content */}
        {(isSubscribed || isMagaluPromo) && relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notícias Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <PaywallTrigger key={relatedPost.id} articleId={relatedPost.id}>
                  <Link
                    to={`/blog/${relatedPost.id}`}
                    className="related-post block group"
                  >
                    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      <div className="p-4">
                        <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 text-xs font-semibold rounded mb-2">
                          {relatedPost.category}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          {relatedPost.timestamp}
                        </div>
                      </div>
                    </article>
                  </Link>
                </PaywallTrigger>
              ))}
            </div>
          </section>
        )}

        {/* Subscription CTA for non-subscribers (except Magalu) */}
        {!isSubscribed && !isMagaluPromo && (
          <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Gostou desta notícia?
            </h3>
            <p className="text-red-100 mb-6 text-lg">
              Assine agora e tenha acesso ilimitado a todas as notícias e conteúdo exclusivo
            </p>
            <button
              onClick={() => setShowPaywall(true)}
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Assinar por R$ 29,90/mês
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;