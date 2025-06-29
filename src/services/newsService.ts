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
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos para mais atualizações
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 2000; // 2 segundos entre requests
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private fallbackCounter = 0;
  private usedTitles = new Set<string>(); // Para evitar duplicatas
  private newsIdCounter = 1000; // Contador único para IDs

  // Pool de imagens variadas para fallback
  private imagePool = [
    'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6196984/pexels-photo-6196984.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.imagePool.length);
    return this.imagePool[randomIndex];
  }

  private generateUniqueId(): number {
    return this.newsIdCounter++;
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
            max: '50', // Aumentado para mais variedade
            ...params
          });

          const url = `${this.BASE_URL}/${endpoint}?${queryParams}`;
          const response = await fetch(url);
          
          if (!response.ok) {
            if (response.status === 429 || response.status === 403) {
              console.warn(`API returned ${response.status}, using enhanced fallback data`);
              const fallbackData = this.getEnhancedFallbackData(endpoint, params);
              this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
              resolve(fallbackData);
              return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: GNewsResponse = await response.json();
          
          // Filter out duplicates and ensure unique content
          const uniqueArticles = this.filterUniqueArticles(data.articles);
          const enhancedData = { ...data, articles: uniqueArticles };
          
          this.cache.set(cacheKey, { data: enhancedData, timestamp: Date.now() });
          resolve(enhancedData);
        } catch (error) {
          console.error('Error fetching news:', error);
          
          const fallbackData = this.getEnhancedFallbackData(endpoint, params);
          this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
          resolve(fallbackData);
        }
      });

      this.processQueue();
    });
  }

  private filterUniqueArticles(articles: GNewsArticle[]): GNewsArticle[] {
    const uniqueArticles: GNewsArticle[] = [];
    const seenTitles = new Set<string>();

    for (const article of articles) {
      const titleKey = article.title.toLowerCase().trim();
      if (!seenTitles.has(titleKey) && !this.usedTitles.has(titleKey)) {
        seenTitles.add(titleKey);
        this.usedTitles.add(titleKey);
        uniqueArticles.push(article);
      }
    }

    return uniqueArticles;
  }

  private async fetchInBackground(endpoint: string, params: Record<string, any>, cacheKey: string): Promise<void> {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) { // 10 minutos
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        apikey: this.API_KEY,
        lang: 'pt',
        country: 'br',
        max: '50',
        ...params
      });

      const url = `${this.BASE_URL}/${endpoint}?${queryParams}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data: GNewsResponse = await response.json();
        const uniqueArticles = this.filterUniqueArticles(data.articles);
        const enhancedData = { ...data, articles: uniqueArticles };
        this.cache.set(cacheKey, { data: enhancedData, timestamp: Date.now() });
      }
    } catch (error) {
      console.error('Background fetch failed:', error);
    }
  }

  private getEnhancedFallbackData(endpoint: string, params: Record<string, any> = {}): GNewsResponse {
    this.fallbackCounter++;
    
    const category = params.category || 'general';
    const query = params.q || '';
    
    const currentTime = new Date();
    const timeOffset = this.fallbackCounter * 45000; // 45 segundos offset
    
    const newsTemplates = [
      // Internacional
      {
        title: "Cúpula internacional define novos acordos de cooperação global",
        description: "Líderes mundiais estabelecem diretrizes para enfrentar desafios globais emergentes.",
        content: "Em sessão extraordinária, representantes de mais de 50 países discutem estratégias coordenadas para questões de segurança, economia e meio ambiente.",
        category: "INTERNACIONAL"
      },
      {
        title: "Tensões diplomáticas marcam reunião de emergência da ONU",
        description: "Conselho de Segurança se reúne para abordar conflitos regionais e buscar soluções pacíficas.",
        content: "A reunião de emergência convocada pela ONU busca mediar tensões crescentes e estabelecer um cronograma para negociações de paz.",
        category: "INTERNACIONAL"
      },
      {
        title: "Acordo comercial histórico é assinado entre blocos econômicos",
        description: "Nova parceria promete revolucionar o comércio internacional e fortalecer economias regionais.",
        content: "O acordo abrange múltiplos setores e estabelece novas diretrizes para cooperação econômica entre as nações participantes.",
        category: "ECONOMIA"
      },
      {
        title: "Mercados globais reagem a novos indicadores econômicos",
        description: "Bolsas de valores registram movimentação significativa após divulgação de dados macroeconômicos.",
        content: "Analistas avaliam impacto dos novos números na economia mundial e perspectivas para os próximos trimestres.",
        category: "ECONOMIA"
      },
      {
        title: "Inovação em inteligência artificial revoluciona diagnósticos médicos",
        description: "Nova tecnologia promete detectar doenças com precisão sem precedentes.",
        content: "Sistemas de IA demonstram capacidade superior na identificação precoce de condições médicas complexas.",
        category: "TECNOLOGIA"
      },
      {
        title: "Computação quântica atinge novo marco histórico",
        description: "Pesquisadores anunciam breakthrough que pode transformar a computação moderna.",
        content: "Avanço representa salto significativo na capacidade de processamento de informações complexas.",
        category: "TECNOLOGIA"
      },
      {
        title: "Conferência climática define metas ambiciosas para próxima década",
        description: "Países se comprometem com redução drástica de emissões e investimentos em energia limpa.",
        content: "Acordo histórico estabelece cronograma detalhado para transição energética global.",
        category: "MEIO AMBIENTE"
      },
      {
        title: "Descoberta arqueológica reescreve história antiga",
        description: "Achados revelam nova perspectiva sobre civilizações perdidas e desenvolvimento humano.",
        content: "Escavações trazem à luz evidências que desafiam teorias estabelecidas sobre o passado.",
        category: "CIÊNCIA"
      },
      {
        title: "Campeonato mundial de futebol bate recordes de audiência",
        description: "Competição internacional atrai milhões de espectadores ao redor do mundo.",
        content: "Evento esportivo registra números históricos de engajamento digital e presencial.",
        category: "ESPORTES"
      },
      {
        title: "Festival internacional de cinema celebra diversidade cultural",
        description: "Evento reúne produções de mais de 80 países em celebração da arte cinematográfica.",
        content: "Festival destaca obras que abordam temas contemporâneos e promovem diálogo intercultural.",
        category: "CULTURA"
      }
    ];

    // Adicionar variações baseadas na busca
    if (query) {
      newsTemplates.unshift({
        title: `Últimas atualizações sobre ${query} geram repercussão internacional`,
        description: `Desenvolvimentos recentes relacionados a ${query} chamam atenção da comunidade global.`,
        content: `Especialistas analisam impactos e desdobramentos dos eventos relacionados a ${query} no cenário atual.`,
        category: "GERAL"
      });
    }

    // Embaralhar e selecionar templates únicos
    const shuffledTemplates = newsTemplates
      .sort(() => Math.random() - 0.5)
      .filter(template => !this.usedTitles.has(template.title.toLowerCase()))
      .slice(0, 25);

    const articles: GNewsArticle[] = shuffledTemplates.map((template, index) => {
      this.usedTitles.add(template.title.toLowerCase());
      
      return {
        title: template.title,
        description: template.description,
        content: template.content,
        url: "#",
        image: this.getRandomImage(),
        publishedAt: new Date(currentTime.getTime() - timeOffset - (index * 120000)).toISOString(), // 2 minutos entre cada
        source: {
          name: this.getRandomSource(),
          url: "https://gnn.com.br"
        }
      };
    });

    return {
      totalArticles: articles.length,
      articles
    };
  }

  private getRandomSource(): string {
    const sources = [
      "Reuters Internacional",
      "BBC News",
      "Associated Press",
      "CNN Internacional",
      "Financial Times",
      "Bloomberg",
      "Wall Street Journal",
      "The Guardian",
      "Le Monde",
      "Deutsche Welle",
      "Al Jazeera",
      "France 24",
      "Euronews",
      "Global News Network"
    ];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  private convertToNewsItem(article: GNewsArticle, index: number, category: string = 'GERAL'): NewsItem {
    const timeAgo = this.getTimeAgo(article.publishedAt);
    
    return {
      id: this.generateUniqueId(),
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) + '...' || '',
      imageUrl: article.image || this.getRandomImage(),
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
        max: '30'
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
        max: '10'
      });
      
      return response.articles.slice(0, 5).map((article, index) => 
        this.convertToNewsItem(article, index, 'URGENTE')
      );
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      return this.getFallbackNewsItems('URGENTE').slice(0, 5);
    }
  }

  // Buscar todas as notícias principais
  async getAllNews(): Promise<NewsItem[]> {
    try {
      const response = await this.makeRequest('top-headlines', { 
        category: 'general',
        max: '50'
      });
      
      const apiItems = response.articles.map((article, index) => 
        this.convertToNewsItem(article, index, 'GERAL')
      );
      
      // Adicionar notícia promocional da Magalu sempre no topo com imagem correta
      const magaluPromo: NewsItem = {
        id: 999999,
        title: "Magalu Lança Queima de Estoque: Projetor Samsung com 50% de Desconto",
        summary: "Magalu oferece promoção relâmpago com descontos imperdíveis em projetores Samsung. Pagamento via PIX com entrega rápida e frete grátis para todo o Brasil.",
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/br/sp-lsbp3buxzd/gallery/br-the-freestyle-sp-lsbp3buxzd-530892018?$650_519_PNG$",
        category: "TECNOLOGIA",
        timestamp: "agora mesmo",
        author: "Magazine Luiza",
        views: 2847,
        status: 'published',
        url: '/promo/magalu-projetor-samsung',
        source: 'Magazine Luiza',
        content: "A Magazine Luiza acaba de lançar uma promoção especial: projetores Samsung The Freestyle com 50% de desconto em queima de estoque. O produto, que normalmente custa R$ 3.999,00, está sendo vendido por apenas R$ 1.999,00. A oferta inclui frete grátis para todo o Brasil e pagamento facilitado via PIX. Esta é uma oportunidade única para adquirir um dos projetores mais avançados do mercado com um desconto excepcional.",
        isMain: false
      };
      
      return [magaluPromo, ...apiItems];
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

  // Limpar cache e títulos usados
  clearCache(): void {
    this.cache.clear();
    this.usedTitles.clear();
    this.newsIdCounter = 1000;
  }

  // Obter estatísticas do cache
  getCacheStats(): { size: number; keys: string[]; uniqueTitles: number } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      uniqueTitles: this.usedTitles.size
    };
  }
}

export const newsService = new NewsService();