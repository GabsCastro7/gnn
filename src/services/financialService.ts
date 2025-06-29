export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
}

export interface CurrencyData {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
}

export interface TwitterTrend {
  name: string;
  volume: number;
  category: string;
  description?: string;
}

class FinancialService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Simular dados de ações brasileiras
  async getBrazilianStocks(): Promise<StockData[]> {
    const cacheKey = 'brazilian_stocks';
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    // Simular dados reais com variação
    const baseStocks = [
      { symbol: 'PETR4', name: 'Petrobras', basePrice: 38.50 },
      { symbol: 'VALE3', name: 'Vale', basePrice: 65.20 },
      { symbol: 'ITUB4', name: 'Itaú Unibanco', basePrice: 25.80 },
      { symbol: 'BBDC4', name: 'Bradesco', basePrice: 13.45 },
      { symbol: 'ABEV3', name: 'Ambev', basePrice: 11.90 },
      { symbol: 'MGLU3', name: 'Magazine Luiza', basePrice: 4.25 },
      { symbol: 'WEGE3', name: 'WEG', basePrice: 42.30 },
      { symbol: 'RENT3', name: 'Localiza', basePrice: 58.70 },
      { symbol: 'LREN3', name: 'Lojas Renner', basePrice: 16.85 },
      { symbol: 'JBSS3', name: 'JBS', basePrice: 28.90 }
    ];

    const stocks: StockData[] = baseStocks.map(stock => {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = stock.basePrice * (1 + variation);
      const change = price - stock.basePrice;
      const changePercent = (change / stock.basePrice) * 100;

      return {
        symbol: stock.symbol,
        name: stock.name,
        price: Number(price.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: `R$ ${(Math.random() * 100 + 10).toFixed(1)}B`
      };
    });

    this.cache.set(cacheKey, { data: stocks, timestamp: Date.now() });
    return stocks;
  }

  // Simular dados de criptomoedas
  async getCryptoData(): Promise<CryptoData[]> {
    const cacheKey = 'crypto_data';
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    const baseCryptos = [
      { symbol: 'BTC', name: 'Bitcoin', basePrice: 95000 },
      { symbol: 'ETH', name: 'Ethereum', basePrice: 3400 },
      { symbol: 'BNB', name: 'Binance Coin', basePrice: 680 },
      { symbol: 'SOL', name: 'Solana', basePrice: 180 },
      { symbol: 'ADA', name: 'Cardano', basePrice: 0.85 },
      { symbol: 'DOT', name: 'Polkadot', basePrice: 7.20 },
      { symbol: 'MATIC', name: 'Polygon', basePrice: 0.95 },
      { symbol: 'LINK', name: 'Chainlink', basePrice: 22.50 }
    ];

    const cryptos: CryptoData[] = baseCryptos.map(crypto => {
      const variation = (Math.random() - 0.5) * 0.15; // ±7.5% variation
      const price = crypto.basePrice * (1 + variation);
      const change24h = price - crypto.basePrice;
      const changePercent24h = (change24h / crypto.basePrice) * 100;

      return {
        symbol: crypto.symbol,
        name: crypto.name,
        price: Number(price.toFixed(crypto.symbol === 'BTC' ? 0 : 2)),
        change24h: Number(change24h.toFixed(2)),
        changePercent24h: Number(changePercent24h.toFixed(2)),
        marketCap: Math.floor(Math.random() * 500000000000) + 10000000000,
        volume24h: Math.floor(Math.random() * 50000000000) + 1000000000
      };
    });

    this.cache.set(cacheKey, { data: cryptos, timestamp: Date.now() });
    return cryptos;
  }

  // Simular dados de moedas
  async getCurrencyData(): Promise<CurrencyData[]> {
    const cacheKey = 'currency_data';
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    const baseCurrencies = [
      { pair: 'USD/BRL', baseRate: 5.85 },
      { pair: 'EUR/BRL', baseRate: 6.15 },
      { pair: 'GBP/BRL', baseRate: 7.25 },
      { pair: 'JPY/BRL', baseRate: 0.039 },
      { pair: 'ARS/BRL', baseRate: 0.0058 }
    ];

    const currencies: CurrencyData[] = baseCurrencies.map(currency => {
      const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
      const rate = currency.baseRate * (1 + variation);
      const change = rate - currency.baseRate;
      const changePercent = (change / currency.baseRate) * 100;

      return {
        pair: currency.pair,
        rate: Number(rate.toFixed(4)),
        change: Number(change.toFixed(4)),
        changePercent: Number(changePercent.toFixed(2))
      };
    });

    this.cache.set(cacheKey, { data: currencies, timestamp: Date.now() });
    return currencies;
  }

  // Simular trends do Twitter
  async getTwitterTrends(): Promise<TwitterTrend[]> {
    const cacheKey = 'twitter_trends';
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    const trendTemplates = [
      { name: '#Bitcoin', category: 'Criptomoedas', description: 'Discussões sobre o preço do Bitcoin' },
      { name: '#Bolsonaro', category: 'Política', description: 'Notícias políticas' },
      { name: '#Lula', category: 'Política', description: 'Governo federal' },
      { name: '#Copa2026', category: 'Esportes', description: 'Preparativos para a Copa do Mundo' },
      { name: '#IA', category: 'Tecnologia', description: 'Inteligência Artificial' },
      { name: '#Economia', category: 'Economia', description: 'Situação econômica brasileira' },
      { name: '#Petrobras', category: 'Economia', description: 'Ações da Petrobras' },
      { name: '#BlackFriday', category: 'Varejo', description: 'Promoções e ofertas' },
      { name: '#Magalu', category: 'Varejo', description: 'Magazine Luiza ofertas' },
      { name: '#Ethereum', category: 'Criptomoedas', description: 'Ethereum e DeFi' },
      { name: '#Flamengo', category: 'Esportes', description: 'Clube de Regatas do Flamengo' },
      { name: '#Corinthians', category: 'Esportes', description: 'Sport Club Corinthians' },
      { name: '#Netflix', category: 'Entretenimento', description: 'Novos lançamentos' },
      { name: '#iPhone', category: 'Tecnologia', description: 'Apple iPhone' },
      { name: '#Tesla', category: 'Tecnologia', description: 'Tesla e carros elétricos' }
    ];

    const trends: TwitterTrend[] = trendTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(trend => ({
        ...trend,
        volume: Math.floor(Math.random() * 500000) + 10000
      }));

    this.cache.set(cacheKey, { data: trends, timestamp: Date.now() });
    return trends;
  }

  // Obter índices das bolsas
  async getMarketIndices(): Promise<StockData[]> {
    const cacheKey = 'market_indices';
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    const baseIndices = [
      { symbol: 'IBOV', name: 'Ibovespa', basePrice: 125000 },
      { symbol: 'IFIX', name: 'IFIX', basePrice: 3200 },
      { symbol: 'SMLL', name: 'Small Cap', basePrice: 4100 },
      { symbol: 'ICON', name: 'ICO2', basePrice: 8500 }
    ];

    const indices: StockData[] = baseIndices.map(index => {
      const variation = (Math.random() - 0.5) * 0.08; // ±4% variation
      const price = index.basePrice * (1 + variation);
      const change = price - index.basePrice;
      const changePercent = (change / index.basePrice) * 100;

      return {
        symbol: index.symbol,
        name: index.name,
        price: Number(price.toFixed(0)),
        change: Number(change.toFixed(0)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000000) + 100000000
      };
    });

    this.cache.set(cacheKey, { data: indices, timestamp: Date.now() });
    return indices;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const financialService = new FinancialService();