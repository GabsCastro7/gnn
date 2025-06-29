import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, BarChart3, Twitter, RefreshCw, Globe } from 'lucide-react';
import { financialService, StockData, CryptoData, CurrencyData, TwitterTrend } from '../services/financialService';

const RealTimeWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stocks' | 'crypto' | 'currency' | 'trends'>('stocks');
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [trends, setTrends] = useState<TwitterTrend[]>([]);
  const [indices, setIndices] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stocksData, cryptosData, currenciesData, trendsData, indicesData] = await Promise.all([
        financialService.getBrazilianStocks(),
        financialService.getCryptoData(),
        financialService.getCurrencyData(),
        financialService.getTwitterTrends(),
        financialService.getMarketIndices()
      ]);

      setStocks(stocksData);
      setCryptos(cryptosData);
      setCurrencies(currenciesData);
      setTrends(trendsData);
      setIndices(indicesData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (num: number, currency: string = 'BRL'): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(num);
  };

  const formatVolume = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
  };

  const tabs = [
    { id: 'stocks', label: 'Ações', icon: BarChart3 },
    { id: 'crypto', label: 'Crypto', icon: Bitcoin },
    { id: 'currency', label: 'Moedas', icon: DollarSign },
    { id: 'trends', label: 'Trends', icon: Twitter }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Globe className="mr-2 text-red-600" size={24} />
          Mercados em Tempo Real
        </h2>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Market Indices */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Índices Principais</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {indices.map((index) => (
            <div key={index.symbol} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{index.symbol}</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {formatNumber(index.price, 0)}
              </div>
              <div className={`text-xs flex items-center ${getChangeColor(index.change)}`}>
                {getChangeIcon(index.change)}
                <span className="ml-1">{index.changePercent > 0 ? '+' : ''}{index.changePercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activeTab === 'stocks' && stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white text-sm">{stock.symbol}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {formatCurrency(stock.price)}
              </div>
              <div className={`text-xs flex items-center justify-end ${getChangeColor(stock.change)}`}>
                {getChangeIcon(stock.change)}
                <span className="ml-1">{stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%</span>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'crypto' && cryptos.map((crypto) => (
          <div key={crypto.symbol} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white text-sm">{crypto.symbol}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{crypto.name}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                ${formatNumber(crypto.price)}
              </div>
              <div className={`text-xs flex items-center justify-end ${getChangeColor(crypto.change24h)}`}>
                {getChangeIcon(crypto.change24h)}
                <span className="ml-1">{crypto.changePercent24h > 0 ? '+' : ''}{crypto.changePercent24h}%</span>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'currency' && currencies.map((currency) => (
          <div key={currency.pair} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white text-sm">{currency.pair}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {formatNumber(currency.rate, 4)}
              </div>
              <div className={`text-xs flex items-center justify-end ${getChangeColor(currency.change)}`}>
                {getChangeIcon(currency.change)}
                <span className="ml-1">{currency.changePercent > 0 ? '+' : ''}{currency.changePercent}%</span>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'trends' && trends.map((trend, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white text-sm">{trend.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{trend.category}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatVolume(trend.volume)} tweets
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Dados atualizados em tempo real
        </div>
      </div>
    </div>
  );
};

export default RealTimeWidget;