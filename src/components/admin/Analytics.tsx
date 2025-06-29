import React, { useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock,
  Globe,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import anime from 'animejs';

const Analytics: React.FC = () => {
  useEffect(() => {
    anime({
      targets: '.analytics-card',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });
  }, []);

  const stats = [
    {
      title: 'Visitantes Únicos',
      value: '45,231',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      period: 'últimos 30 dias'
    },
    {
      title: 'Visualizações de Página',
      value: '128,456',
      change: '+8.2%',
      changeType: 'positive',
      icon: Eye,
      period: 'últimos 30 dias'
    },
    {
      title: 'Tempo Médio na Página',
      value: '3m 42s',
      change: '-2.1%',
      changeType: 'negative',
      icon: Clock,
      period: 'últimos 30 dias'
    },
    {
      title: 'Taxa de Rejeição',
      value: '34.2%',
      change: '-5.3%',
      changeType: 'positive',
      icon: TrendingUp,
      period: 'últimos 30 dias'
    }
  ];

  const topPages = [
    { page: '/internacional/cupula-g20', views: 15420, percentage: 12.1 },
    { page: '/politica/eleicoes-argentina', views: 12350, percentage: 9.6 },
    { page: '/economia/mercados-europeus', views: 9870, percentage: 7.7 },
    { page: '/tecnologia/ia-saude', views: 8640, percentage: 6.8 },
    { page: '/blog/acordo-nuclear-ira', views: 7250, percentage: 5.7 }
  ];

  const trafficSources = [
    { source: 'Busca Orgânica', visitors: 18500, percentage: 41.0 },
    { source: 'Direto', visitors: 12300, percentage: 27.2 },
    { source: 'Redes Sociais', visitors: 8900, percentage: 19.7 },
    { source: 'Referências', visitors: 3200, percentage: 7.1 },
    { source: 'Email', visitors: 2300, percentage: 5.1 }
  ];

  const deviceStats = [
    { device: 'Desktop', percentage: 52.3, icon: Monitor },
    { device: 'Mobile', percentage: 41.7, icon: Smartphone },
    { device: 'Tablet', percentage: 6.0, icon: Monitor }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="analytics-card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Acompanhe o desempenho do seu site</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="analytics-card bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Icon className="text-red-600" size={24} />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.period}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="analytics-card bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Páginas Mais Visitadas</h2>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {page.page}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {page.views.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{page.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="analytics-card bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Fontes de Tráfego</h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {source.source}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {source.visitors.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Stats */}
      <div className="analytics-card bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Dispositivos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deviceStats.map((device, index) => {
            const Icon = device.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-gray-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {device.device}
                </h3>
                <p className="text-2xl font-bold text-red-600 mb-2">
                  {device.percentage}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="analytics-card bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Estatísticas em Tempo Real
            </h3>
            <p className="text-red-700">Usuários ativos no site agora</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-800 mb-1">247</div>
            <p className="text-sm text-red-600">usuários online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;