export interface AffiliateNetwork {
  id: string;
  name: string;
  description: string;
  categories: string[];
  commission: string;
  minPayout: number;
  paymentMethods: string[];
  geoTargeting: string[];
  trackingMethod: 'postback' | 'pixel' | 'api';
  isActive: boolean;
}

export interface AffiliateOffer {
  id: string;
  networkId: string;
  title: string;
  description: string;
  category: string;
  payout: number;
  payoutType: 'cpa' | 'cpl' | 'cps' | 'revshare';
  countries: string[];
  trafficTypes: string[];
  landingPageUrl: string;
  trackingUrl: string;
  creatives: {
    banners: string[];
    popups: string[];
    native: string[];
  };
  restrictions: string[];
  isActive: boolean;
}

export interface MonetizationStats {
  totalRevenue: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  averagePayout: number;
  topPerformingOffers: AffiliateOffer[];
  revenueByNetwork: Record<string, number>;
  revenueByCategory: Record<string, number>;
}

class AffiliateService {
  private networks: AffiliateNetwork[] = [
    {
      id: 'crakrevenue',
      name: 'CrakRevenue',
      description: 'Rede robusta com Dating, Cam, VOD, AI e OnlyFans',
      categories: ['dating', 'cam', 'vod', 'ai', 'onlyfans', 'igaming', 'gaming', 'health', 'nutra'],
      commission: '40-70% RevShare',
      minPayout: 100,
      paymentMethods: ['wire', 'paypal', 'paxum', 'crypto'],
      geoTargeting: ['BR', 'US', 'CA', 'EU', 'AU'],
      trackingMethod: 'postback',
      isActive: true
    },
    {
      id: 'adultforce',
      name: 'AdultForce',
      description: 'Marcas premium como Brazzers, Reality Kings, SeanCody',
      categories: ['paysites', 'gay', 'amateur', 'gaming'],
      commission: '50-60% RevShare',
      minPayout: 100,
      paymentMethods: ['wire', 'paypal', 'check'],
      geoTargeting: ['US', 'CA', 'EU', 'AU'],
      trackingMethod: 'pixel',
      isActive: true
    },
    {
      id: 'royalpartners',
      name: 'Royal Partners',
      description: 'Especializada em iGaming e cassinos online',
      categories: ['igaming', 'casino', 'sports-betting'],
      commission: '25-45% RevShare',
      minPayout: 100,
      paymentMethods: ['wire', 'skrill', 'neteller'],
      geoTargeting: ['BR', 'EU', 'CA'],
      trackingMethod: 'api',
      isActive: true
    },
    {
      id: 'awempire',
      name: 'AWEmpire',
      description: 'Programa oficial da LiveJasmin - Live Cam',
      categories: ['livecam', 'webcam'],
      commission: '35-50% RevShare',
      minPayout: 50,
      paymentMethods: ['wire', 'paypal', 'paxum'],
      geoTargeting: ['Global'],
      trackingMethod: 'postback',
      isActive: true
    },
    {
      id: 'admitad',
      name: 'Admitad',
      description: 'Rede global com 33 programas de tráfego adulto no Brasil',
      categories: ['ecommerce', 'adult', 'finance', 'travel', 'tech'],
      commission: '1-15% CPS',
      minPayout: 20,
      paymentMethods: ['paypal', 'wire', 'webmoney'],
      geoTargeting: ['BR', 'Global'],
      trackingMethod: 'pixel',
      isActive: true
    },
    {
      id: 'exoclick',
      name: 'ExoClick',
      description: 'Rede de publicidade com eCPM e programa de referência',
      categories: ['display', 'native', 'push', 'popunder'],
      commission: 'eCPM + 5% RefShare',
      minPayout: 20,
      paymentMethods: ['paypal', 'wire', 'payoneer'],
      geoTargeting: ['Global'],
      trackingMethod: 'pixel',
      isActive: true
    }
  ];

  private offers: AffiliateOffer[] = [
    // CrakRevenue Offers
    {
      id: 'cr_dating_br',
      networkId: 'crakrevenue',
      title: 'Dating Premium Brasil',
      description: 'Site de relacionamentos premium para público brasileiro',
      category: 'dating',
      payout: 45,
      payoutType: 'cpa',
      countries: ['BR'],
      trafficTypes: ['display', 'native', 'social'],
      landingPageUrl: 'https://dating-premium.com/br',
      trackingUrl: 'https://track.crakrevenue.com/dating-br',
      creatives: {
        banners: ['300x250', '728x90', '160x600'],
        popups: ['fullscreen', 'exit-intent'],
        native: ['article-style', 'recommendation']
      },
      restrictions: ['No email spam', 'No misleading ads'],
      isActive: true
    },
    {
      id: 'cr_cam_global',
      networkId: 'crakrevenue',
      title: 'Live Cam Global',
      description: 'Plataforma de webcam ao vivo com modelos internacionais',
      category: 'cam',
      payout: 35,
      payoutType: 'revshare',
      countries: ['Global'],
      trafficTypes: ['display', 'native', 'push'],
      landingPageUrl: 'https://livecam-global.com',
      trackingUrl: 'https://track.crakrevenue.com/cam-global',
      creatives: {
        banners: ['300x250', '728x90', '320x50'],
        popups: ['entry', 'exit-intent'],
        native: ['chat-style', 'live-preview']
      },
      restrictions: ['18+ only', 'No underage content'],
      isActive: true
    },
    // Royal Partners iGaming
    {
      id: 'rp_casino_br',
      networkId: 'royalpartners',
      title: 'Casino Royal Brasil',
      description: 'Cassino online premium com jogos ao vivo',
      category: 'igaming',
      payout: 150,
      payoutType: 'cpa',
      countries: ['BR'],
      trafficTypes: ['display', 'native', 'search'],
      landingPageUrl: 'https://casino-royal.com.br',
      trackingUrl: 'https://track.royalpartners.com/casino-br',
      creatives: {
        banners: ['300x250', '728x90', '970x250'],
        popups: ['welcome-bonus', 'free-spins'],
        native: ['game-preview', 'bonus-offer']
      },
      restrictions: ['21+ only', 'Responsible gambling'],
      isActive: true
    },
    // AdultForce Premium
    {
      id: 'af_brazzers',
      networkId: 'adultforce',
      title: 'Brazzers Premium',
      description: 'Acesso premium ao conteúdo Brazzers',
      category: 'paysites',
      payout: 40,
      payoutType: 'cpa',
      countries: ['US', 'CA', 'EU'],
      trafficTypes: ['display', 'native'],
      landingPageUrl: 'https://brazzers.com/premium',
      trackingUrl: 'https://track.adultforce.com/brazzers',
      creatives: {
        banners: ['300x250', '728x90'],
        popups: ['trial-offer'],
        native: ['content-preview']
      },
      restrictions: ['18+ only', 'Premium content only'],
      isActive: true
    },
    // AWEmpire LiveJasmin
    {
      id: 'aw_livejasmin',
      networkId: 'awempire',
      title: 'LiveJasmin Premium',
      description: 'Plataforma premium de webcam ao vivo',
      category: 'livecam',
      payout: 50,
      payoutType: 'revshare',
      countries: ['Global'],
      trafficTypes: ['display', 'native', 'push'],
      landingPageUrl: 'https://livejasmin.com',
      trackingUrl: 'https://track.awempire.com/livejasmin',
      creatives: {
        banners: ['300x250', '728x90', '160x600'],
        popups: ['model-preview', 'free-credits'],
        native: ['live-chat', 'model-gallery']
      },
      restrictions: ['18+ only', 'No fake profiles'],
      isActive: true
    }
  ];

  private stats: MonetizationStats = {
    totalRevenue: 15420.50,
    totalClicks: 125000,
    totalConversions: 1250,
    conversionRate: 1.0,
    averagePayout: 12.34,
    topPerformingOffers: [],
    revenueByNetwork: {
      'crakrevenue': 6500.00,
      'royalpartners': 4200.00,
      'adultforce': 2800.00,
      'awempire': 1920.50
    },
    revenueByCategory: {
      'dating': 4500.00,
      'igaming': 4200.00,
      'cam': 3200.00,
      'paysites': 2800.00,
      'livecam': 720.50
    }
  };

  async getNetworks(): Promise<AffiliateNetwork[]> {
    return this.networks.filter(network => network.isActive);
  }

  async getOffers(filters?: {
    networkId?: string;
    category?: string;
    country?: string;
    minPayout?: number;
  }): Promise<AffiliateOffer[]> {
    let filteredOffers = this.offers.filter(offer => offer.isActive);

    if (filters) {
      if (filters.networkId) {
        filteredOffers = filteredOffers.filter(offer => offer.networkId === filters.networkId);
      }
      if (filters.category) {
        filteredOffers = filteredOffers.filter(offer => offer.category === filters.category);
      }
      if (filters.country) {
        filteredOffers = filteredOffers.filter(offer => 
          offer.countries.includes(filters.country!) || offer.countries.includes('Global')
        );
      }
      if (filters.minPayout) {
        filteredOffers = filteredOffers.filter(offer => offer.payout >= filters.minPayout!);
      }
    }

    return filteredOffers;
  }

  async getStats(): Promise<MonetizationStats> {
    // Simular dados em tempo real
    const randomVariation = (base: number, variance: number = 0.1) => {
      return base * (1 + (Math.random() - 0.5) * variance);
    };

    return {
      ...this.stats,
      totalRevenue: randomVariation(this.stats.totalRevenue),
      totalClicks: Math.floor(randomVariation(this.stats.totalClicks)),
      totalConversions: Math.floor(randomVariation(this.stats.totalConversions))
    };
  }

  async trackClick(offerId: string, userId?: string, source?: string): Promise<void> {
    // Implementar tracking de cliques
    const offer = this.offers.find(o => o.id === offerId);
    if (offer) {
      console.log(`Tracking click for offer: ${offer.title}`);
      // Enviar para sistema de tracking
    }
  }

  async trackConversion(offerId: string, userId?: string, amount?: number): Promise<void> {
    // Implementar tracking de conversões
    const offer = this.offers.find(o => o.id === offerId);
    if (offer) {
      console.log(`Tracking conversion for offer: ${offer.title}, amount: ${amount}`);
      // Enviar para sistema de tracking
    }
  }

  generateTrackingUrl(offerId: string, userId?: string, source?: string): string {
    const offer = this.offers.find(o => o.id === offerId);
    if (!offer) return '';

    const params = new URLSearchParams({
      offer_id: offerId,
      ...(userId && { user_id: userId }),
      ...(source && { source }),
      timestamp: Date.now().toString()
    });

    return `${offer.trackingUrl}?${params.toString()}`;
  }

  async getOptimalOffers(userProfile: {
    country: string;
    interests: string[];
    deviceType: 'mobile' | 'desktop';
    trafficSource: string;
  }): Promise<AffiliateOffer[]> {
    const offers = await this.getOffers({
      country: userProfile.country
    });

    // Algoritmo de otimização baseado no perfil do usuário
    return offers
      .filter(offer => {
        // Filtrar por interesses
        const hasMatchingInterest = userProfile.interests.some(interest => 
          offer.category.toLowerCase().includes(interest.toLowerCase())
        );
        
        // Filtrar por tipo de tráfego suportado
        const supportsTrafficSource = offer.trafficTypes.includes(userProfile.trafficSource);
        
        return hasMatchingInterest && supportsTrafficSource;
      })
      .sort((a, b) => {
        // Ordenar por payout e performance
        const aScore = a.payout * (a.category === 'igaming' ? 1.2 : 1.0);
        const bScore = b.payout * (b.category === 'igaming' ? 1.2 : 1.0);
        return bScore - aScore;
      })
      .slice(0, 5);
  }
}

export const affiliateService = new AffiliateService();