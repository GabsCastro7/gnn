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
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutos para mais atualizações
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1500; // 1.5 segundos entre requests
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private fallbackCounter = 0;
  private usedTitles = new Set<string>(); // Para evitar duplicatas
  private newsIdCounter = 1000; // Contador único para IDs
  private imageIndex = 0; // Para rotacionar imagens

  // Pool massivamente expandido de imagens confiáveis do Pexels
  private imagePool = [
    // Notícias e Jornalismo
    'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6196984/pexels-photo-6196984.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Política e Governo
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Economia e Negócios
    'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6801644/pexels-photo-6801644.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6801646/pexels-photo-6801646.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6801650/pexels-photo-6801650.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Tecnologia
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3861976/pexels-photo-3861976.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4164853/pexels-photo-4164853.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4164856/pexels-photo-4164856.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4164871/pexels-photo-4164871.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4164885/pexels-photo-4164885.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Internacional e Mundo
    'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3769146/pexels-photo-3769146.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3769151/pexels-photo-3769151.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3769158/pexels-photo-3769158.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3769164/pexels-photo-3769164.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3769170/pexels-photo-3769170.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3769176/pexels-photo-3769176.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Saúde e Medicina
    'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4021784/pexels-photo-4021784.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4021789/pexels-photo-4021789.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4021794/pexels-photo-4021794.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4021799/pexels-photo-4021799.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4021804/pexels-photo-4021804.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4021809/pexels-photo-4021809.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Esportes
    'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621111/pexels-photo-3621111.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621118/pexels-photo-3621118.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621125/pexels-photo-3621125.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621132/pexels-photo-3621132.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621139/pexels-photo-3621139.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621146/pexels-photo-3621146.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621153/pexels-photo-3621153.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Meio Ambiente
    'https://images.pexels.com/photos/3621160/pexels-photo-3621160.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621167/pexels-photo-3621167.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621174/pexels-photo-3621174.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621181/pexels-photo-3621181.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621188/pexels-photo-3621188.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621195/pexels-photo-3621195.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621202/pexels-photo-3621202.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3621209/pexels-photo-3621209.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Ciência e Pesquisa
    'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3825584/pexels-photo-3825584.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3825587/pexels-photo-3825587.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3825590/pexels-photo-3825590.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3825593/pexels-photo-3825593.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3825596/pexels-photo-3825596.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3825599/pexels-photo-3825599.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3825602/pexels-photo-3825602.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Cultura e Arte
    'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3944094/pexels-photo-3944094.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3944097/pexels-photo-3944097.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3944100/pexels-photo-3944100.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3944103/pexels-photo-3944103.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3944106/pexels-photo-3944106.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3944109/pexels-photo-3944109.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3944112/pexels-photo-3944112.jpeg?auto=compress&cs=tinysrgb&w=800',
    
    // Educação
    'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4050321/pexels-photo-4050321.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4050324/pexels-photo-4050324.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4050327/pexels-photo-4050327.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4050330/pexels-photo-4050330.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4050333/pexels-photo-4050333.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4050336/pexels-photo-4050336.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getRandomImage(): string {
    // Usar rotação sequencial para garantir variedade
    const image = this.imagePool[this.imageIndex % this.imagePool.length];
    this.imageIndex++;
    return image;
  }

  private getImageByCategory(category: string): string {
    const categoryImages: Record<string, string[]> = {
      'INTERNACIONAL': this.imagePool.slice(32, 40),
      'POLÍTICA': this.imagePool.slice(7, 15),
      'ECONOMIA': this.imagePool.slice(16, 24),
      'TECNOLOGIA': this.imagePool.slice(24, 32),
      'SAÚDE': this.imagePool.slice(40, 48),
      'ESPORTES': this.imagePool.slice(48, 56),
      'MEIO AMBIENTE': this.imagePool.slice(56, 64),
      'CIÊNCIA': this.imagePool.slice(64, 72),
      'CULTURA': this.imagePool.slice(72, 80),
      'EDUCAÇÃO': this.imagePool.slice(80, 88)
    };

    const categoryPool = categoryImages[category.toUpperCase()] || this.imagePool;
    const randomIndex = Math.floor(Math.random() * categoryPool.length);
    return categoryPool[randomIndex];
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
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutos
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
    const timeOffset = this.fallbackCounter * 30000; // 30 segundos offset
    
    const newsTemplates = [
      // Internacional - Mais variado
      {
        title: "Cúpula do G20 define novos acordos de cooperação econômica global",
        description: "Líderes mundiais estabelecem diretrizes para enfrentar desafios econômicos emergentes.",
        content: "Em sessão extraordinária, representantes de mais de 50 países discutem estratégias coordenadas para questões de segurança, economia e meio ambiente.",
        category: "INTERNACIONAL"
      },
      {
        title: "União Europeia anuncia pacote de investimentos em energia renovável",
        description: "Bloco europeu destina bilhões para transição energética e redução de emissões.",
        content: "O novo pacote de investimentos visa acelerar a transição para fontes de energia limpa em toda a Europa.",
        category: "INTERNACIONAL"
      },
      {
        title: "Tensões diplomáticas marcam reunião de emergência da ONU",
        description: "Conselho de Segurança se reúne para abordar conflitos regionais e buscar soluções pacíficas.",
        content: "A reunião de emergência convocada pela ONU busca mediar tensões crescentes e estabelecer um cronograma para negociações de paz.",
        category: "INTERNACIONAL"
      },
      {
        title: "China anuncia nova política de abertura comercial para mercados emergentes",
        description: "Governo chinês estabelece novas diretrizes para facilitar comércio com países em desenvolvimento.",
        content: "As novas medidas visam fortalecer parcerias comerciais e reduzir barreiras para importações e exportações.",
        category: "INTERNACIONAL"
      },
      {
        title: "Acordo histórico é assinado entre blocos econômicos do Pacífico",
        description: "Nova parceria promete revolucionar o comércio internacional e fortalecer economias regionais.",
        content: "O acordo abrange múltiplos setores e estabelece novas diretrizes para cooperação econômica entre as nações participantes.",
        category: "ECONOMIA"
      },
      {
        title: "Mercados globais reagem positivamente a novos indicadores econômicos",
        description: "Bolsas de valores registram alta após divulgação de dados macroeconômicos favoráveis.",
        content: "Analistas avaliam impacto dos novos números na economia mundial e perspectivas otimistas para os próximos trimestres.",
        category: "ECONOMIA"
      },
      {
        title: "Banco Central brasileiro mantém taxa de juros em reunião do Copom",
        description: "Decisão reflete cenário de estabilidade inflacionária e crescimento econômico moderado.",
        content: "A manutenção da taxa Selic em 10,75% ao ano foi unânime entre os membros do comitê.",
        category: "ECONOMIA"
      },
      {
        title: "Petrobras anuncia descoberta de novo campo de petróleo no pré-sal",
        description: "Nova descoberta pode aumentar significativamente as reservas brasileiras de petróleo.",
        content: "O campo localizado na Bacia de Santos tem potencial para produção de milhões de barris por dia.",
        category: "ECONOMIA"
      },
      {
        title: "Inovação em inteligência artificial revoluciona diagnósticos médicos",
        description: "Nova tecnologia promete detectar doenças com precisão sem precedentes.",
        content: "Sistemas de IA demonstram capacidade superior na identificação precoce de condições médicas complexas.",
        category: "TECNOLOGIA"
      },
      {
        title: "Computação quântica atinge novo marco histórico em pesquisa brasileira",
        description: "Pesquisadores da USP anunciam breakthrough que pode transformar a computação moderna.",
        content: "Avanço representa salto significativo na capacidade de processamento de informações complexas.",
        category: "TECNOLOGIA"
      },
      {
        title: "Startup brasileira desenvolve solução inovadora para energia solar",
        description: "Nova tecnologia promete reduzir custos de instalação de painéis solares em 40%.",
        content: "A inovação pode acelerar a adoção de energia solar residencial no Brasil.",
        category: "TECNOLOGIA"
      },
      {
        title: "5G chega a mais 50 cidades brasileiras neste mês",
        description: "Expansão da rede 5G acelera digitalização e conectividade no interior do país.",
        content: "A nova cobertura beneficiará mais de 10 milhões de brasileiros com internet de alta velocidade.",
        category: "TECNOLOGIA"
      },
      {
        title: "Conferência climática define metas ambiciosas para próxima década",
        description: "Países se comprometem com redução drástica de emissões e investimentos em energia limpa.",
        content: "Acordo histórico estabelece cronograma detalhado para transição energética global.",
        category: "MEIO AMBIENTE"
      },
      {
        title: "Amazônia registra menor índice de desmatamento em 15 anos",
        description: "Dados do INPE mostram redução significativa na destruição da floresta amazônica.",
        content: "Políticas de preservação e fiscalização intensificada contribuem para resultado positivo.",
        category: "MEIO AMBIENTE"
      },
      {
        title: "Descoberta arqueológica reescreve história do Brasil colonial",
        description: "Achados em Minas Gerais revelam nova perspectiva sobre período colonial brasileiro.",
        content: "Escavações trazem à luz evidências que desafiam teorias estabelecidas sobre o passado.",
        category: "CIÊNCIA"
      },
      {
        title: "Cientistas brasileiros desenvolvem vacina contra dengue mais eficaz",
        description: "Nova vacina mostra 95% de eficácia em testes clínicos avançados.",
        content: "Pesquisa conduzida pelo Instituto Butantan pode revolucionar prevenção da dengue no país.",
        category: "SAÚDE"
      },
      {
        title: "Copa do Mundo de 2026 terá jogos em 12 cidades brasileiras",
        description: "FIFA confirma sedes brasileiras para o mundial que será realizado em três países.",
        content: "Brasil, Estados Unidos e México sediarão conjuntamente a Copa do Mundo de 2026.",
        category: "ESPORTES"
      },
      {
        title: "Seleção brasileira convoca novos talentos para eliminatórias",
        description: "Técnico Dorival Júnior aposta em jovens promessas para próximos jogos.",
        content: "Lista inclui revelações do futebol brasileiro que se destacaram na temporada.",
        category: "ESPORTES"
      },
      {
        title: "Festival de Cannes 2025 terá recorde de filmes brasileiros",
        description: "Cinema nacional ganha destaque internacional com 8 produções selecionadas.",
        content: "Filmes brasileiros concorrem em diferentes categorias do prestigioso festival francês.",
        category: "CULTURA"
      },
      {
        title: "Museu Nacional reabre com nova exposição sobre biodiversidade brasileira",
        description: "Após reconstrução, museu apresenta acervo renovado sobre fauna e flora nacionais.",
        content: "Exposição interativa utiliza tecnologia de realidade virtual para experiência imersiva.",
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
      .slice(0, 35);

    const articles: GNewsArticle[] = shuffledTemplates.map((template, index) => {
      this.usedTitles.add(template.title.toLowerCase());
      
      return {
        title: template.title,
        description: template.description,
        content: template.content,
        url: "#",
        image: this.getImageByCategory(template.category),
        publishedAt: new Date(currentTime.getTime() - timeOffset - (index * 90000)).toISOString(), // 1.5 minutos entre cada
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
      "BBC News Brasil",
      "Associated Press",
      "CNN Brasil",
      "Financial Times",
      "Bloomberg Brasil",
      "Wall Street Journal",
      "The Guardian",
      "Le Monde",
      "Deutsche Welle Brasil",
      "Al Jazeera",
      "France 24",
      "Euronews Brasil",
      "Agência Brasil",
      "Folha de S.Paulo",
      "O Globo",
      "Estado de S.Paulo",
      "UOL Notícias",
      "G1 Globo",
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
      imageUrl: article.image || this.getImageByCategory(category),
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
    this.imageIndex = 0;
  }

  // Obter estatísticas do cache
  getCacheStats(): { size: number; keys: string[]; uniqueTitles: number; totalImages: number } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      uniqueTitles: this.usedTitles.size,
      totalImages: this.imagePool.length
    };
  }
}

export const newsService = new NewsService();