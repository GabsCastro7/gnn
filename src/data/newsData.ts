// This file is now deprecated in favor of the real-time GNews API
// Keeping it for backward compatibility and fallback scenarios

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

// Real-time fallback data that gets updated
export const generateFallbackNews = (): NewsItem[] => {
  const currentTime = new Date();
  const categories = ['INTERNACIONAL', 'POLÍTICA', 'ECONOMIA', 'TECNOLOGIA', 'ESPORTES', 'SAÚDE'];
  const sources = ['Reuters', 'BBC', 'CNN', 'Associated Press', 'Global News Network'];
  
  const newsTemplates = [
    {
      title: "Líderes mundiais se reúnem para discutir questões globais urgentes",
      summary: "Cúpula internacional aborda mudanças climáticas, economia e segurança mundial em sessão extraordinária.",
      category: "INTERNACIONAL"
    },
    {
      title: "Mercados financeiros registram movimentação significativa",
      summary: "Bolsas de valores respondem a novos indicadores econômicos e decisões de política monetária.",
      category: "ECONOMIA"
    },
    {
      title: "Avanços tecnológicos revolucionam setor de comunicações",
      summary: "Novas tecnologias prometem transformar a forma como nos conectamos e compartilhamos informações.",
      category: "TECNOLOGIA"
    },
    {
      title: "Descoberta científica abre novas possibilidades na medicina",
      summary: "Pesquisadores anunciam breakthrough que pode impactar tratamentos médicos futuros.",
      category: "SAÚDE"
    },
    {
      title: "Competições esportivas internacionais atraem milhões de espectadores",
      summary: "Eventos esportivos globais quebram recordes de audiência e engajamento digital.",
      category: "ESPORTES"
    },
    {
      title: "Negociações diplomáticas buscam resolver tensões regionais",
      summary: "Diplomatas trabalham intensivamente para encontrar soluções pacíficas para conflitos atuais.",
      category: "POLÍTICA"
    }
  ];

  return newsTemplates.map((template, index) => ({
    id: Date.now() + index,
    title: template.title,
    summary: template.summary,
    imageUrl: `https://images.pexels.com/photos/${6193518 + index}/pexels-photo-${6193518 + index}.jpeg?auto=compress&cs=tinysrgb&w=800`,
    category: template.category,
    timestamp: index === 0 ? 'agora mesmo' : `há ${index * 15} minutos`,
    author: sources[index % sources.length],
    views: Math.floor(Math.random() * 5000) + 500,
    status: 'published' as const,
    url: '#',
    source: sources[index % sources.length],
    content: `${template.summary} Este é um conteúdo gerado automaticamente para demonstrar o sistema de notícias em tempo real do Global News Network.`,
    isMain: index === 0
    })).concat({
    id: Date.now() + 999,
    title: "Magalu Lança Queima de Estoque: Projetor Samsung com 50% de Desconto",
    summary: "Magalu oferece promoção relâmpago com descontos imperdíveis em projetores Samsung, pagamento via PIX e conversão automática para criptomoedas através de corretora sem KYC.",
    category: "TECNOLOGIA",
    timestamp: "há 5 minutos",
    author: "Magalu News",
    views: 1500,
    status: "published",
    url: "#",
    source: "Magalu",
    content: "A Magalu acaba de lançar uma promoção especial: projetores Samsung com 50% de desconto em queima de estoque. Disponível para aquisição com pagamento via PIX, convertido automaticamente para criptomoedas através de nossa corretora parceira Purga.co.",
    imageUrl: "https://images.pexels.com/photos/730547/pe...d=auto&cs=tinysrgb&w=800",
    isMain: false
  });
};

// For backward compatibility
export const fallbackNewsData: NewsItem[] = generateFallbackNews();
export const newsData = fallbackNewsData;
