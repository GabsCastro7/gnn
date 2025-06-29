import { useState, useEffect } from 'react';
import { affiliateService } from '../services/affiliateService';

interface MonetizationConfig {
  enablePopups: boolean;
  enableBanners: boolean;
  enableNativeAds: boolean;
  enableStickyAds: boolean;
  popupFrequency: number; // em minutos
  maxPopupsPerSession: number;
  userSegment: 'new' | 'returning' | 'engaged';
}

interface MonetizationStats {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
}

export const useMonetization = () => {
  const [config, setConfig] = useState<MonetizationConfig>({
    enablePopups: true,
    enableBanners: true,
    enableNativeAds: true,
    enableStickyAds: true,
    popupFrequency: 5,
    maxPopupsPerSession: 3,
    userSegment: 'new'
  });

  const [stats, setStats] = useState<MonetizationStats>({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0
  });

  const [sessionData, setSessionData] = useState({
    popupsShown: 0,
    lastPopupTime: 0,
    startTime: Date.now(),
    pageViews: 0,
    interactions: 0
  });

  useEffect(() => {
    // Detectar tipo de usuário
    detectUserSegment();
    
    // Carregar configuração salva
    loadSavedConfig();
    
    // Inicializar tracking
    initializeTracking();
  }, []);

  const detectUserSegment = () => {
    const visits = localStorage.getItem('gnn_visits');
    const lastVisit = localStorage.getItem('gnn_last_visit');
    const timeOnSite = localStorage.getItem('gnn_time_on_site');

    let segment: 'new' | 'returning' | 'engaged' = 'new';

    if (visits && parseInt(visits) > 1) {
      segment = 'returning';
    }

    if (timeOnSite && parseInt(timeOnSite) > 300000) { // 5 minutos
      segment = 'engaged';
    }

    setConfig(prev => ({ ...prev, userSegment: segment }));
  };

  const loadSavedConfig = () => {
    const savedConfig = localStorage.getItem('gnn_monetization_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  };

  const initializeTracking = () => {
    // Track page view
    trackImpression();
    
    // Update visit count
    const visits = parseInt(localStorage.getItem('gnn_visits') || '0') + 1;
    localStorage.setItem('gnn_visits', visits.toString());
    localStorage.setItem('gnn_last_visit', Date.now().toString());

    // Set site start time for session tracking
    (window as any).siteStartTime = Date.now();
  };

  const trackImpression = () => {
    setStats(prev => ({
      ...prev,
      impressions: prev.impressions + 1
    }));
  };

  const trackClick = async (adId: string, source: string) => {
    try {
      await affiliateService.trackClick(adId, getUserId(), source);
      
      setStats(prev => {
        const newClicks = prev.clicks + 1;
        return {
          ...prev,
          clicks: newClicks,
          ctr: (newClicks / prev.impressions) * 100
        };
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const trackConversion = async (adId: string, amount: number) => {
    try {
      await affiliateService.trackConversion(adId, getUserId(), amount);
      
      setStats(prev => {
        const newConversions = prev.conversions + 1;
        const newRevenue = prev.revenue + amount;
        return {
          ...prev,
          conversions: newConversions,
          revenue: newRevenue,
          conversionRate: (newConversions / prev.clicks) * 100
        };
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  };

  const shouldShowPopup = (): boolean => {
    const now = Date.now();
    const timeSinceLastPopup = now - sessionData.lastPopupTime;
    const frequencyMs = config.popupFrequency * 60 * 1000;

    return (
      config.enablePopups &&
      sessionData.popupsShown < config.maxPopupsPerSession &&
      timeSinceLastPopup > frequencyMs
    );
  };

  const recordPopupShown = () => {
    setSessionData(prev => ({
      ...prev,
      popupsShown: prev.popupsShown + 1,
      lastPopupTime: Date.now()
    }));
  };

  const getUserId = (): string => {
    let userId = localStorage.getItem('gnn_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('gnn_user_id', userId);
    }
    return userId;
  };

  const updateConfig = (newConfig: Partial<MonetizationConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('gnn_monetization_config', JSON.stringify(updatedConfig));
  };

  const getOptimalAdPlacement = (pageType: string, userSegment: string) => {
    const placements = {
      home: {
        new: ['header-banner', 'sidebar-banner', 'native-inline'],
        returning: ['sidebar-banner', 'native-recommendation'],
        engaged: ['native-inline', 'sticky-bottom']
      },
      article: {
        new: ['content-banner', 'native-inline', 'popup-exit'],
        returning: ['native-recommendation', 'sidebar-banner'],
        engaged: ['native-inline', 'related-content']
      },
      blog: {
        new: ['header-banner', 'grid-native', 'popup-scroll'],
        returning: ['grid-native', 'sidebar-banner'],
        engaged: ['native-recommendation', 'sticky-top']
      }
    };

    return placements[pageType as keyof typeof placements]?.[userSegment as keyof typeof placements.home] || [];
  };

  return {
    config,
    stats,
    sessionData,
    shouldShowPopup,
    recordPopupShown,
    trackClick,
    trackConversion,
    trackImpression,
    updateConfig,
    getOptimalAdPlacement,
    userSegment: config.userSegment
  };
};