import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'zh' | 'ja' | 'ar' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header
    'header.home': 'Início',
    'header.international': 'Internacional',
    'header.politics': 'Política',
    'header.economy': 'Economia',
    'header.technology': 'Tecnologia',
    'header.blog': 'Blog',
    'header.suggest': 'Sugerir Notícia',
    'header.about': 'Sobre',
    'header.contact': 'Contato',
    'header.search': 'Buscar notícias...',
    'header.live': 'AO VIVO',
    
    // Home
    'home.title': 'Global News Network',
    'home.subtitle': 'Sua fonte confiável para notícias internacionais',
    'home.coverage': 'Horas de Cobertura',
    'home.countries': 'Países Cobertos',
    'home.news': 'Notícias por Dia',
    'home.explore': 'Explore Notícias',
    'home.highlights': 'Destaques Internacionais',
    'home.latest': 'Últimas Notícias',
    'home.viewAll': 'Ver Todas as Notícias',
    
    // Footer
    'footer.about': 'Sobre Nós',
    'footer.team': 'Nossa Equipe',
    'footer.mission': 'Missão e Valores',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Uso',
    'footer.sections': 'Seções',
    'footer.services': 'Serviços',
    'footer.newsletter': 'Newsletter',
    'footer.contact': 'Contato',
    'footer.newsroom': 'Redação',
    'footer.description': 'Sua fonte confiável para notícias internacionais. Cobertura 24/7 dos principais acontecimentos mundiais com jornalismo sério e imparcial.',
    'footer.copyright': '© 2024 Global News Network. Todos os direitos reservados.',
    'footer.powered': 'Jornalismo independente e confiável',
    
    // Common
    'common.views': 'visualizações',
    'common.readMore': 'Ler mais',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Deletar',
    'common.edit': 'Editar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.newest': 'Mais Recentes',
    'common.oldest': 'Mais Antigas',
    'common.popular': 'Mais Populares',
    
    // Categories
    'category.international': 'INTERNACIONAL',
    'category.politics': 'POLÍTICA',
    'category.economy': 'ECONOMIA',
    'category.technology': 'TECNOLOGIA',
    'category.health': 'SAÚDE',
    'category.environment': 'MEIO AMBIENTE',
    'category.sports': 'ESPORTES',
    'category.culture': 'CULTURA',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.news': 'Notícias',
    'admin.users': 'Usuários',
    'admin.analytics': 'Analytics',
    'admin.media': 'Mídia',
    'admin.seo': 'SEO',
    'admin.settings': 'Configurações',
    'admin.overview': 'Visão geral do sistema GNN',
    'admin.totalNews': 'Total de Notícias',
    'admin.activeUsers': 'Usuários Ativos',
    'admin.todayViews': 'Visualizações Hoje',
    'admin.engagement': 'Taxa de Engajamento',
    
    // Blog
    'blog.title': 'Blog GNN',
    'blog.subtitle': 'Acompanhe as últimas notícias e análises dos principais acontecimentos mundiais',
    'blog.searchNews': 'Buscar notícias...',
    'blog.allCategories': 'Todas as Categorias',
    'blog.showing': 'Mostrando',
    'blog.of': 'de',
    'blog.news': 'notícias',
    'blog.noResults': 'Nenhuma notícia encontrada',
    'blog.adjustFilters': 'Tente ajustar os filtros ou criar uma nova notícia',
    'blog.previous': 'Anterior',
    'blog.next': 'Próxima',
    
    // Contact
    'contact.title': 'Entre em Contato',
    'contact.subtitle': 'Estamos aqui para ouvir você. Entre em contato conosco para dúvidas, sugestões ou oportunidades de colaboração.',
    'contact.generalEmail': 'Email Geral',
    'contact.generalEmailDesc': 'Para dúvidas gerais e informações',
    'contact.phoneDesc': 'Atendimento de segunda a sexta, 9h às 18h',
    'contact.addressDesc': 'CEP: 01310-100',
    'contact.hours': 'Horário de Funcionamento',
    'contact.hoursDesc': 'Nossa redação funciona 24 horas por dia',
    'contact.sendMessage': 'Envie sua Mensagem',
    'contact.fullName': 'Nome Completo',
    'contact.email': 'Email',
    'contact.department': 'Departamento',
    'contact.subject': 'Assunto',
    'contact.message': 'Mensagem',
    'contact.send': 'Enviar Mensagem',
    'contact.sending': 'Enviando...',
    'contact.messageSent': 'Mensagem Enviada!',
    'contact.thankYou': 'Obrigado pelo contato. Responderemos em breve.',
    
    // About
    'about.title': 'Global News Network',
    'about.subtitle': 'Conectando o mundo através do jornalismo de qualidade, levando informação confiável a todos os cantos do planeta.',
    'about.mission': 'Nossa Missão',
    'about.missionDesc': 'A GNN nasceu com o propósito de democratizar o acesso à informação internacional de qualidade. Acreditamos que um mundo mais conectado e informado é um mundo melhor.',
    'about.values': 'Nossos Valores',
    'about.valuesDesc': 'Os princípios que guiam nosso trabalho e definem nossa identidade jornalística.',
    'about.team': 'Nossa Equipe',
    'about.teamDesc': 'Profissionais experientes e apaixonados por jornalismo, dedicados a trazer as melhores notícias para você.',
    'about.history': 'Nossa História',
    'about.historyDesc': 'A GNN foi fundada em 2020 com a visão de criar uma ponte entre as notícias internacionais e o público brasileiro.',
    'about.joinUs': 'Quer Fazer Parte da Nossa História?',
    'about.joinUsDesc': 'Estamos sempre em busca de talentos apaixonados por jornalismo. Entre em contato conosco e descubra as oportunidades disponíveis.',
    'about.contactUs': 'Entre em Contato',
    'about.workWithUs': 'Trabalhe Conosco',
    
    // Suggest News
    'suggest.title': 'Sugira uma Notícia',
    'suggest.subtitle': 'Tem uma notícia importante? Compartilhe conosco! Nossa equipe de jornalistas irá analisar e verificar todas as sugestões.',
    'suggest.newsInfo': 'Informações da Notícia',
    'suggest.newsTitle': 'Título da Notícia',
    'suggest.category': 'Categoria',
    'suggest.description': 'Descrição da Notícia',
    'suggest.source': 'Fonte da Informação',
    'suggest.urgency': 'Nível de Urgência',
    'suggest.contactInfo': 'Informações de Contato',
    'suggest.phone': 'Telefone',
    'suggest.attachments': 'Anexos (Opcional)',
    'suggest.dragFiles': 'Arraste arquivos aqui ou clique para selecionar',
    'suggest.selectFiles': 'Selecionar Arquivos',
    'suggest.additionalInfo': 'Informações Adicionais',
    'suggest.sendSuggestion': 'Enviar Sugestão',
    'suggest.suggestionSent': 'Sugestão Enviada com Sucesso!',
    'suggest.thankYouSuggestion': 'Obrigado por sua contribuição. Nossa equipe irá analisar sua sugestão e entrar em contato se necessário.',
    'suggest.disclaimer': 'Todas as sugestões são analisadas por nossa equipe editorial. Nos reservamos o direito de verificar a veracidade das informações antes da publicação.',
  },
  
  en: {
    // Header
    'header.home': 'Home',
    'header.international': 'International',
    'header.politics': 'Politics',
    'header.economy': 'Economy',
    'header.technology': 'Technology',
    'header.blog': 'Blog',
    'header.suggest': 'Suggest News',
    'header.about': 'About',
    'header.contact': 'Contact',
    'header.search': 'Search news...',
    'header.live': 'LIVE',
    
    // Home
    'home.title': 'Global News Network',
    'home.subtitle': 'Your trusted source for international news',
    'home.coverage': 'Hours of Coverage',
    'home.countries': 'Countries Covered',
    'home.news': 'News per Day',
    'home.explore': 'Explore News',
    'home.highlights': 'International Highlights',
    'home.latest': 'Latest News',
    'home.viewAll': 'View All News',
    
    // Footer
    'footer.about': 'About Us',
    'footer.team': 'Our Team',
    'footer.mission': 'Mission & Values',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.sections': 'Sections',
    'footer.services': 'Services',
    'footer.newsletter': 'Newsletter',
    'footer.contact': 'Contact',
    'footer.newsroom': 'Newsroom',
    'footer.description': 'Your trusted source for international news. 24/7 coverage of major world events with serious and impartial journalism.',
    'footer.copyright': '© 2024 Global News Network. All rights reserved.',
    'footer.powered': 'Independent and reliable journalism',
    
    // Common
    'common.views': 'views',
    'common.readMore': 'Read more',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.newest': 'Newest',
    'common.oldest': 'Oldest',
    'common.popular': 'Most Popular',
    
    // Categories
    'category.international': 'INTERNATIONAL',
    'category.politics': 'POLITICS',
    'category.economy': 'ECONOMY',
    'category.technology': 'TECHNOLOGY',
    'category.health': 'HEALTH',
    'category.environment': 'ENVIRONMENT',
    'category.sports': 'SPORTS',
    'category.culture': 'CULTURE',
  },
  
  es: {
    // Header
    'header.home': 'Inicio',
    'header.international': 'Internacional',
    'header.politics': 'Política',
    'header.economy': 'Economía',
    'header.technology': 'Tecnología',
    'header.blog': 'Blog',
    'header.suggest': 'Sugerir Noticia',
    'header.about': 'Acerca de',
    'header.contact': 'Contacto',
    'header.search': 'Buscar noticias...',
    'header.live': 'EN VIVO',
    
    // Home
    'home.title': 'Global News Network',
    'home.subtitle': 'Tu fuente confiable de noticias internacionales',
    'home.coverage': 'Horas de Cobertura',
    'home.countries': 'Países Cubiertos',
    'home.news': 'Noticias por Día',
    'home.explore': 'Explorar Noticias',
    'home.highlights': 'Destacados Internacionales',
    'home.latest': 'Últimas Noticias',
    'home.viewAll': 'Ver Todas las Noticias',
    
    // Common
    'common.views': 'visualizaciones',
    'common.readMore': 'Leer más',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.newest': 'Más Recientes',
    'common.oldest': 'Más Antiguas',
    'common.popular': 'Más Populares',
    
    // Categories
    'category.international': 'INTERNACIONAL',
    'category.politics': 'POLÍTICA',
    'category.economy': 'ECONOMÍA',
    'category.technology': 'TECNOLOGÍA',
    'category.health': 'SALUD',
    'category.environment': 'MEDIO AMBIENTE',
    'category.sports': 'DEPORTES',
    'category.culture': 'CULTURA',
  },
  
  fr: {
    // Header
    'header.home': 'Accueil',
    'header.international': 'International',
    'header.politics': 'Politique',
    'header.economy': 'Économie',
    'header.technology': 'Technologie',
    'header.blog': 'Blog',
    'header.suggest': 'Suggérer une Actualité',
    'header.about': 'À propos',
    'header.contact': 'Contact',
    'header.search': 'Rechercher des actualités...',
    'header.live': 'EN DIRECT',
    
    // Home
    'home.title': 'Global News Network',
    'home.subtitle': 'Votre source fiable d\'actualités internationales',
    'home.coverage': 'Heures de Couverture',
    'home.countries': 'Pays Couverts',
    'home.news': 'Actualités par Jour',
    'home.explore': 'Explorer les Actualités',
    'home.highlights': 'Points Forts Internationaux',
    'home.latest': 'Dernières Actualités',
    'home.viewAll': 'Voir Toutes les Actualités',
    
    // Common
    'common.views': 'vues',
    'common.readMore': 'Lire la suite',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.newest': 'Plus Récentes',
    'common.oldest': 'Plus Anciennes',
    'common.popular': 'Plus Populaires',
    
    // Categories
    'category.international': 'INTERNATIONAL',
    'category.politics': 'POLITIQUE',
    'category.economy': 'ÉCONOMIE',
    'category.technology': 'TECHNOLOGIE',
    'category.health': 'SANTÉ',
    'category.environment': 'ENVIRONNEMENT',
    'category.sports': 'SPORTS',
    'category.culture': 'CULTURE',
  },
  
  de: {
    // Header
    'header.home': 'Startseite',
    'header.international': 'International',
    'header.politics': 'Politik',
    'header.economy': 'Wirtschaft',
    'header.technology': 'Technologie',
    'header.blog': 'Blog',
    'header.suggest': 'Nachricht Vorschlagen',
    'header.about': 'Über uns',
    'header.contact': 'Kontakt',
    'header.search': 'Nachrichten suchen...',
    'header.live': 'LIVE',
    
    // Home
    'home.title': 'Global News Network',
    'home.subtitle': 'Ihre vertrauenswürdige Quelle für internationale Nachrichten',
    'home.coverage': 'Stunden Berichterstattung',
    'home.countries': 'Abgedeckte Länder',
    'home.news': 'Nachrichten pro Tag',
    'home.explore': 'Nachrichten Erkunden',
    'home.highlights': 'Internationale Highlights',
    'home.latest': 'Neueste Nachrichten',
    'home.viewAll': 'Alle Nachrichten Anzeigen',
    
    // Common
    'common.views': 'Aufrufe',
    'common.readMore': 'Weiterlesen',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.newest': 'Neueste',
    'common.oldest': 'Älteste',
    'common.popular': 'Beliebteste',
    
    // Categories
    'category.international': 'INTERNATIONAL',
    'category.politics': 'POLITIK',
    'category.economy': 'WIRTSCHAFT',
    'category.technology': 'TECHNOLOGIE',
    'category.health': 'GESUNDHEIT',
    'category.environment': 'UMWELT',
    'category.sports': 'SPORT',
    'category.culture': 'KULTUR',
  },
  
  it: {
    // Header
    'header.home': 'Home',
    'header.international': 'Internazionale',
    'header.politics': 'Politica',
    'header.economy': 'Economia',
    'header.technology': 'Tecnologia',
    'header.blog': 'Blog',
    'header.suggest': 'Suggerisci Notizia',
    'header.about': 'Chi Siamo',
    'header.contact': 'Contatti',
    'header.search': 'Cerca notizie...',
    'header.live': 'LIVE',
    
    // Home
    'home.title': 'Global News Network',
    'home.subtitle': 'La tua fonte affidabile per le notizie internazionali',
    'home.coverage': 'Ore di Copertura',
    'home.countries': 'Paesi Coperti',
    'home.news': 'Notizie al Giorno',
    'home.explore': 'Esplora Notizie',
    'home.highlights': 'Highlights Internazionali',
    'home.latest': 'Ultime Notizie',
    'home.viewAll': 'Vedi Tutte le Notizie',
    
    // Common
    'common.views': 'visualizzazioni',
    'common.readMore': 'Leggi di più',
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.success': 'Successo',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.sort': 'Ordina',
    'common.newest': 'Più Recenti',
    'common.oldest': 'Più Vecchie',
    'common.popular': 'Più Popolari',
    
    // Categories
    'category.international': 'INTERNAZIONALE',
    'category.politics': 'POLITICA',
    'category.economy': 'ECONOMIA',
    'category.technology': 'TECNOLOGIA',
    'category.health': 'SALUTE',
    'category.environment': 'AMBIENTE',
    'category.sports': 'SPORT',
    'category.culture': 'CULTURA',
  },
  
  zh: {
    // Header
    'header.home': '首页',
    'header.international': '国际',
    'header.politics': '政治',
    'header.economy': '经济',
    'header.technology': '科技',
    'header.blog': '博客',
    'header.suggest': '建议新闻',
    'header.about': '关于我们',
    'header.contact': '联系我们',
    'header.search': '搜索新闻...',
    'header.live': '直播',
    
    // Home
    'home.title': '全球新闻网络',
    'home.subtitle': '您值得信赖的国际新闻来源',
    'home.coverage': '报道时间',
    'home.countries': '覆盖国家',
    'home.news': '每日新闻',
    'home.explore': '探索新闻',
    'home.highlights': '国际要闻',
    'home.latest': '最新新闻',
    'home.viewAll': '查看所有新闻',
    
    // Common
    'common.views': '浏览量',
    'common.readMore': '阅读更多',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.newest': '最新',
    'common.oldest': '最旧',
    'common.popular': '最受欢迎',
    
    // Categories
    'category.international': '国际',
    'category.politics': '政治',
    'category.economy': '经济',
    'category.technology': '科技',
    'category.health': '健康',
    'category.environment': '环境',
    'category.sports': '体育',
    'category.culture': '文化',
  },
  
  ja: {
    // Header
    'header.home': 'ホーム',
    'header.international': '国際',
    'header.politics': '政治',
    'header.economy': '経済',
    'header.technology': 'テクノロジー',
    'header.blog': 'ブログ',
    'header.suggest': 'ニュース提案',
    'header.about': '私たちについて',
    'header.contact': 'お問い合わせ',
    'header.search': 'ニュースを検索...',
    'header.live': 'ライブ',
    
    // Home
    'home.title': 'グローバルニュースネットワーク',
    'home.subtitle': '信頼できる国際ニュースソース',
    'home.coverage': '報道時間',
    'home.countries': 'カバー国',
    'home.news': '1日のニュース',
    'home.explore': 'ニュースを探索',
    'home.highlights': '国際ハイライト',
    'home.latest': '最新ニュース',
    'home.viewAll': 'すべてのニュースを見る',
    
    // Common
    'common.views': 'ビュー',
    'common.readMore': '続きを読む',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': 'ソート',
    'common.newest': '最新',
    'common.oldest': '最古',
    'common.popular': '人気',
    
    // Categories
    'category.international': '国際',
    'category.politics': '政治',
    'category.economy': '経済',
    'category.technology': 'テクノロジー',
    'category.health': '健康',
    'category.environment': '環境',
    'category.sports': 'スポーツ',
    'category.culture': '文化',
  },
  
  ar: {
    // Header
    'header.home': 'الرئيسية',
    'header.international': 'دولي',
    'header.politics': 'سياسة',
    'header.economy': 'اقتصاد',
    'header.technology': 'تكنولوجيا',
    'header.blog': 'مدونة',
    'header.suggest': 'اقتراح خبر',
    'header.about': 'من نحن',
    'header.contact': 'اتصل بنا',
    'header.search': 'البحث في الأخبار...',
    'header.live': 'مباشر',
    
    // Home
    'home.title': 'شبكة الأخبار العالمية',
    'home.subtitle': 'مصدرك الموثوق للأخبار الدولية',
    'home.coverage': 'ساعات التغطية',
    'home.countries': 'البلدان المغطاة',
    'home.news': 'الأخبار يومياً',
    'home.explore': 'استكشف الأخبار',
    'home.highlights': 'أبرز الأحداث الدولية',
    'home.latest': 'آخر الأخبار',
    'home.viewAll': 'عرض جميع الأخبار',
    
    // Common
    'common.views': 'مشاهدات',
    'common.readMore': 'اقرأ المزيد',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تحرير',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.newest': 'الأحدث',
    'common.oldest': 'الأقدم',
    'common.popular': 'الأكثر شعبية',
    
    // Categories
    'category.international': 'دولي',
    'category.politics': 'سياسة',
    'category.economy': 'اقتصاد',
    'category.technology': 'تكنولوجيا',
    'category.health': 'صحة',
    'category.environment': 'بيئة',
    'category.sports': 'رياضة',
    'category.culture': 'ثقافة',
  },
  
  ru: {
    // Header
    'header.home': 'Главная',
    'header.international': 'Международные',
    'header.politics': 'Политика',
    'header.economy': 'Экономика',
    'header.technology': 'Технологии',
    'header.blog': 'Блог',
    'header.suggest': 'Предложить новость',
    'header.about': 'О нас',
    'header.contact': 'Контакты',
    'header.search': 'Поиск новостей...',
    'header.live': 'ПРЯМОЙ ЭФИР',
    
    // Home
    'home.title': 'Глобальная Новостная Сеть',
    'home.subtitle': 'Ваш надежный источник международных новостей',
    'home.coverage': 'Часы освещения',
    'home.countries': 'Охваченные страны',
    'home.news': 'Новости в день',
    'home.explore': 'Исследовать новости',
    'home.highlights': 'Международные события',
    'home.latest': 'Последние новости',
    'home.viewAll': 'Посмотреть все новости',
    
    // Common
    'common.views': 'просмотров',
    'common.readMore': 'Читать далее',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.sort': 'Сортировка',
    'common.newest': 'Новейшие',
    'common.oldest': 'Старейшие',
    'common.popular': 'Популярные',
    
    // Categories
    'category.international': 'МЕЖДУНАРОДНЫЕ',
    'category.politics': 'ПОЛИТИКА',
    'category.economy': 'ЭКОНОМИКА',
    'category.technology': 'ТЕХНОЛОГИИ',
    'category.health': 'ЗДОРОВЬЕ',
    'category.environment': 'ОКРУЖАЮЩАЯ СРЕДА',
    'category.sports': 'СПОРТ',
    'category.culture': 'КУЛЬТУРА',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && Object.keys(translations).includes(saved)) {
      return saved;
    }
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    return Object.keys(translations).includes(browserLang) ? browserLang : 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    
    // Set RTL for Arabic
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];