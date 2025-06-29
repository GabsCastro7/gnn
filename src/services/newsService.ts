export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}



export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  timestamp: string;
  isMain?: boolean;
  author?: string;
  views?: number;
  status?: 'published' | 'draft' | 'archived';
  url?: string;
  source?: string;
  content?: string;
}

class NewsService {
  private readonly API_KEY = '5abc995c804756f55fc0a6752e402aa3';
  private readonly BASE_URL = 'https://gnews.io/api/v4';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours cache for better performance
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private fallbackCounter = 0;

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
          await new Promise(resolve => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest));
        }

        try {
          await request();
          this.lastRequestTime = Date.now();
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<GNewsResponse> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(cacheKey);

    // Return cached data if available and valid
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    // If we have expired cache, return it while fetching new data in background
    if (cached) {
      this.fetchInBackground(endpoint, params, cacheKey);
      return cached.data;
    }

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const queryParams = new URLSearchParams({
            apikey: this.API_KEY,
            lang: 'pt',
            country: 'br',
            max: '25', // Increased for better content variety
            ...params
          });

          const url = `${this.BASE_URL}/${endpoint}?${queryParams}`;
          const response = await fetch(url);
          
          if (!response.ok) {
            if (response.status === 429 || response.status === 403) {
              // Rate limited or forbidden - return enhanced fallback data
              console.warn(`API returned ${response.status}, using fallback data`);
              const fallbackData = this.getEnhancedFallbackData(endpoint, params);
              this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
              resolve(fallbackData);
              return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: GNewsResponse = await response.json();
          
          // Cache the result
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
          resolve(data);
        } catch (error) {
          console.error('Error fetching news:', error);
          
          // Return enhanced fallback data on error
          const fallbackData = this.getEnhancedFallbackData(endpoint, params);
          this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
          resolve(fallbackData);
        }
      });

      this.processQueue();
    });
  }

  private async fetchInBackground(endpoint: string, params: Record<string, any>, cacheKey: string): Promise<void> {
    // Don't fetch if we're rate limited or have very recent data
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) { // 15 minutes
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        apikey: this.API_KEY,
        lang: 'pt',
        country: 'br',
        max: '25',
        ...params
      });

      const url = `${this.BASE_URL}/${endpoint}?${queryParams}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data: GNewsResponse = await response.json();
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }
    } catch (error) {
      console.error('Background fetch failed:', error);
    }
  }

  private getEnhancedFallbackData(endpoint: string, params: Record<string, any> = {}): GNewsResponse {
    this.fallbackCounter++;
    
    const category = params.category || 'general';
    const query = params.q || '';
    
    // Generate dynamic content based on current time and parameters
    const currentTime = new Date();
    const timeOffset = this.fallbackCounter * 30000; // 30 seconds offset per call
    
    const categoryTemplates: Record<string, any[]> = {
      world: [
        {
          title: "Tensões diplomáticas marcam reunião internacional de emergência",
          description: "Líderes mundiais se reúnem para discutir questões de segurança global e cooperação internacional.",
          content: "Em uma sessão extraordinária, representantes de diversos países abordam temas cruciais para a estabilidade mundial.",
          image: "https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800",
          source: { name: "Reuters Internacional", url: "https://reuters.com" }
        },
        {
          title: "Acordo comercial histórico é assinado entre blocos econômicos",
          description: "Nova parceria promete revolucionar o comércio internacional e fortalecer economias regionais.",
          content: "O acordo abrange múltiplos setores e estabelece novas diretrizes para cooperação econômica.",
          image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600",
          source: { name: "Financial Times", url: "https://ft.com" }
        }
      ],
      business: [
        {
          title: "Mercados globais reagem a novos indicadores econômicos",
          description: "Bolsas de valores registram movimentação significativa após divulgação de dados macroeconômicos.",
          content: "Analistas avaliam impacto dos novos números na economia mundial e perspectivas futuras.",
          image: "https://images.pexels.com/photos/6196984/pexels-photo-6196984.jpeg?auto=compress&cs=tinysrgb&w=600",
          source: { name: "Bloomberg", url: "https://bloomberg.com" }
        },
        {
          title: "Inovação tecnológica impulsiona crescimento do setor financeiro",
          description: "Fintechs e bancos digitais lideram transformação no mercado financeiro global.",
          content: "Novas tecnologias prometem democratizar acesso a serviços financeiros em escala mundial.",
          image: "https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=600",
          source: { name: "Wall Street Journal", url: "https://wsj.com" }
        }
      ],
      technology: [
        {
          title: "Inteligência artificial revoluciona diagnósticos médicos",
          description: "Nova tecnologia promete detectar doenças com precisão sem precedentes.",
          content: "Sistemas de IA demonstram capacidade superior na identificação precoce de condições médicas.",
          image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
          source: { name: "TechCrunch", url: "https://techcrunch.com" }
        },
        {
          title: "Computação quântica atinge novo marco histórico",
          description: "Pesquisadores anunciam breakthrough que pode transformar a computação moderna.",
          content: "Avanço representa salto significativo na capacidade de processamento de informações complexas.",
          image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
          source: { name: "MIT Technology Review", url: "https://technologyreview.com" }
        }
      ],
      general: [
        {
          title: "Conferência climática define metas ambiciosas para próxima década",
          description: "Países se comprometem com redução drástica de emissões e investimentos em energia limpa.",
          content: "Acordo histórico estabelece cronograma detalhado para transição energética global.",
          image: "https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=600",
          source: { name: "BBC News", url: "https://bbc.com" }
        },
        {
          title: "Descoberta arqueológica reescreve história antiga",
          description: "Achados revelam nova perspectiva sobre civilizações perdidas e desenvolvimento humano.",
          content: "Escavações trazem à luz evidências que desafiam teorias estabelecidas sobre o passado.",
          image: "https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=600",
          source: { name: "National Geographic", url: "https://nationalgeographic.com" }
        }
      ]
    };

    const templates = categoryTemplates[category] || categoryTemplates.general;
    const selectedTemplates = [...templates];
    
    // Add some variety based on search query
    if (query) {
      selectedTemplates.unshift({
        title: `Últimas atualizações sobre ${query} geram repercussão mundial`,
        description: `Desenvolvimentos recentes relacionados a ${query} chamam atenção da comunidade internacional.`,
        content: `Especialistas analisam impactos e desdobramentos dos eventos relacionados a ${query}.`,
        image: "https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800",
        source: { name: "Global News Network", url: "https://gnn.com.br" }
      });
    }

    const articles: GNewsArticle[] = selectedTemplates.map((template, index) => ({
      title: template.title,
      description: template.description,
      content: template.content,
      url: "#",
      image: template.image,
      publishedAt: new Date(currentTime.getTime() - timeOffset - (index * 60000)).toISOString(),
      source: template.source
    }));

    return {
      totalArticles: articles.length,
      articles
    };
  }

  private convertToNewsItem(article: GNewsArticle, index: number, category: string = 'GERAL'): NewsItem {
    const timeAgo = this.getTimeAgo(article.publishedAt);
    
    return {
      id: Date.now() + index + Math.random() * 1000,
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) + '...' || '',
      imageUrl: article.image || 'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: category.toUpperCase(),
      timestamp: timeAgo,
      author: article.source.name,
      views: Math.floor(Math.random() * 5000) + 100,
      status: 'published' as const,
      url: article.url,
      source: article.source.name,
      content: article.content,
      isMain: index === 0
    };
  }

  private getTimeAgo(publishedAt: string): string {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'agora mesmo';
    if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  }

  // Buscar notícias por categoria
  async getTopHeadlines(category: string = 'general'): Promise<NewsItem[]> {
    try {
      const categoryMap: Record<string, string> = {
        'internacional': 'world',
        'politica': 'nation',
        'economia': 'business',
        'tecnologia': 'technology',
        'esportes': 'sports',
        'saude': 'health',
        'ciencia': 'science',
        'entretenimento': 'entertainment',
        'geral': 'general'
      };

      const gnewsCategory = categoryMap[category.toLowerCase()] || 'general';
      const response = await this.makeRequest('top-headlines', { category: gnewsCategory });
      
      return response.articles.map((article, index) => 
        this.convertToNewsItem(article, index, category)
      );
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      return this.getFallbackNewsItems(category);
    }
  }

  // Buscar notícias por palavra-chave
  async searchNews(query: string, category?: string): Promise<NewsItem[]> {
    try {
      const params: Record<string, any> = { q: query };
      
      if (category && category !== 'all') {
        params.q = `${query} ${category}`;
      }

      const response = await this.makeRequest('search', params);
      
      return response.articles.map((article, index) => 
        this.convertToNewsItem(article, index, category || 'BUSCA')
      );
    } catch (error) {
      console.error('Error searching news:', error);
      return this.getFallbackNewsItems('BUSCA');
    }
  }

  // Buscar notícias internacionais
  async getInternationalNews(): Promise<NewsItem[]> {
    try {
      const response = await this.makeRequest('top-headlines', { 
        category: 'world',
        max: '20'
      });
      
      const newsItems = response.articles.map((article, index) => 
        this.convertToNewsItem(article, index, 'INTERNACIONAL')
      );

      return newsItems.slice(0, 20);
    } catch (error) {
      console.error('Error fetching international news:', error);
      return this.getFallbackNewsItems('INTERNACIONAL');
    }
  }

  // Buscar notícias de última hora
  async getBreakingNews(): Promise<NewsItem[]> {
    try {
      const response = await this.makeRequest('top-headlines', { 
        category: 'general',
        max: '5'
      });
      
      return response.articles.slice(0, 3).map((article, index) => 
        this.convertToNewsItem(article, index, 'URGENTE')
      );
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      return this.getFallbackNewsItems('URGENTE').slice(0, 3);
    }
  }

  // Buscar todas as notícias principais
  async getAllNews(): Promise<NewsItem[]> {
    try {
      const response = await this.makeRequest('top-headlines', { 
        category: 'general',
        max: '30'
      });
      
      const apiItems = response.articles.map((article, index) => 
        this.convertToNewsItem(article, index, 'GERAL')
      );
      // prepend manual promo items so they always appear
      const manualItems: NewsItem[] = [{
        id: Date.now() + 99999,
        title: "Magalu Lança Queima de Estoque: Projetor Samsung com 50% de Desconto",
        summary: "Magalu oferece promoção relâmpago com descontos imperdíveis em projetores Samsung, pagamento via PIX.",
        imageUrl: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "TECNOLOGIA",
        timestamp: "agora mesmo",
        author: "Magalu News",
        views: 1500,
        status: 'published',
        url: '/artigo/magalu-projetor-samsung',
        source: 'Magalu',
        content: "A Magalu acaba de lançar uma promoção especial: projetores Samsung com 50% de desconto em queima de estoque. Pagamento via PIX no link de compra.",
        isMain: false
      }];
      return [...manualItems, ...apiItems];
    } catch (error) {
      console.error('Error fetching all news:', error);
      return this.getFallbackNewsItems('GERAL');
    }
  }

  private getFallbackNewsItems(category: string): NewsItem[] {
    const fallbackData = this.getEnhancedFallbackData('fallback', { category });
    return fallbackData.articles.map((article, index) => 
      this.convertToNewsItem(article, index, category)
    );
  }

  // Limpar cache
  clearCache(): void {
    this.cache.clear();
  }

  // Obter estatísticas do cache
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const newsService = new NewsService();