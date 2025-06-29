import React, { useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Globe, 
  Clock,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import anime from 'animejs';

const Dashboard: React.FC = () => {
  useEffect(() => {
    anime({
      targets: '.dashboard-card',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });

    // Animate numbers
    anime({
      targets: '.stat-number',
      innerHTML: [0, (el: any) => el.getAttribute('data-value')],
      duration: 2000,
      round: 1,
      easing: 'easeOutQuad'
    });
  }, []);

  const stats = [
    {
      title: 'Total de Notícias',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Usuários Ativos',
      value: '8,492',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Visualizações Hoje',
      value: '24,681',
      change: '+15%',
      changeType: 'positive',
      icon: Eye,
      color: 'purple'
    },
    {
      title: 'Taxa de Engajamento',
      value: '67%',
      change: '-3%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'red'
    }
  ];

  const recentActivity = [
    {
      action: 'Nova notícia publicada',
      details: 'Tensões diplomáticas no Oriente Médio',
      time: 'há 5 minutos',
      type: 'publish'
    },
    {
      action: 'Usuário cadastrado',
      details: 'maria.silva@email.com',
      time: 'há 12 minutos',
      type: 'user'
    },
    {
      action: 'Notícia editada',
      details: 'Economia global em foco',
      time: 'há 25 minutos',
      type: 'edit'
    },
    {
      action: 'Comentário moderado',
      details: 'Comentário removido por violação',
      time: 'há 1 hora',
      type: 'moderate'
    }
  ];

  const topArticles = [
    {
      title: 'Cúpula do G20 debate mudanças climáticas',
      views: 15420,
      engagement: '89%'
    },
    {
      title: 'Tensões diplomáticas aumentam',
      views: 12350,
      engagement: '76%'
    },
    {
      title: 'União Europeia aprova novo pacote',
      views: 9870,
      engagement: '82%'
    },
    {
      title: 'Eleições presidenciais na Argentina',
      views: 8640,
      engagement: '71%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dashboard-card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema GNN</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="dashboard-card bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="stat-number text-2xl font-bold text-gray-900" data-value={stat.value.replace(/[^\d]/g, '')}>
                    0
                  </p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUp size={16} className="mr-1" />
                    ) : (
                      <ArrowDown size={16} className="mr-1" />
                    )}
                    {stat.change} vs mês anterior
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="dashboard-card bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="mr-2 text-red-600" size={24} />
              Atividade Recente
            </h2>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'publish' ? 'bg-green-500' :
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'edit' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Articles */}
        <div className="dashboard-card bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 text-red-600" size={24} />
              Artigos Mais Populares
            </h2>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Ver relatório
            </button>
          </div>
          <div className="space-y-4">
            {topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {article.views.toLocaleString()} views
                    </span>
                    <span>Engajamento: {article.engagement}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors">
            <div className="text-center">
              <FileText className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm font-medium text-gray-600">Nova Notícia</p>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors">
            <div className="text-center">
              <Users className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm font-medium text-gray-600">Gerenciar Usuários</p>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors">
            <div className="text-center">
              <Globe className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm font-medium text-gray-600">Ver Site</p>
            </div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="dashboard-card bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Status do Sistema</h3>
            <p className="text-red-700">Todos os sistemas operando normalmente</p>
            <div className="flex items-center mt-2 text-sm text-red-600">
              <Clock size={16} className="mr-1" />
              Última verificação: há 2 minutos
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-semibold">Online</span>
            </div>
            <p className="text-sm text-red-600">Uptime: 99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;