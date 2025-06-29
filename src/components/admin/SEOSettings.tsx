import React, { useState } from 'react';
import { Search, Globe, Tag, Link, BarChart3, Save } from 'lucide-react';

const SEOSettings: React.FC = () => {
  const [seoData, setSeoData] = useState({
    siteTitle: 'GNN - Global News Network',
    siteDescription: 'Sua fonte confiável para notícias internacionais, política, economia e muito mais.',
    keywords: 'notícias, internacional, política, economia, GNN, jornalismo',
    ogTitle: 'GNN - Global News Network',
    ogDescription: 'Notícias internacionais confiáveis e atualizadas',
    twitterCard: 'summary_large_image',
    robotsTxt: 'User-agent: *\nAllow: /',
    sitemap: 'https://gnn.com.br/sitemap.xml'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSeoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Simulate save
    console.log('SEO settings saved:', seoData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações SEO</h1>
        <p className="text-gray-600">Otimize seu site para mecanismos de busca</p>
      </div>

      {/* Basic SEO */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Search className="mr-2 text-red-600" />
          SEO Básico
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Título do Site
            </label>
            <input
              type="text"
              id="siteTitle"
              name="siteTitle"
              value={seoData.siteTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Título principal do site"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recomendado: 50-60 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Site
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={seoData.siteDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Descrição que aparece nos resultados de busca"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recomendado: 150-160 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
              Palavras-chave
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={seoData.keywords}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Palavras-chave separadas por vírgula"
            />
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Globe className="mr-2 text-red-600" />
          Open Graph (Facebook)
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Título OG
            </label>
            <input
              type="text"
              id="ogTitle"
              name="ogTitle"
              value={seoData.ogTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição OG
            </label>
            <textarea
              id="ogDescription"
              name="ogDescription"
              value={seoData.ogDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Twitter Cards */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Tag className="mr-2 text-red-600" />
          Twitter Cards
        </h2>

        <div>
          <label htmlFor="twitterCard" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Card
          </label>
          <select
            id="twitterCard"
            name="twitterCard"
            value={seoData.twitterCard}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary Large Image</option>
            <option value="app">App</option>
            <option value="player">Player</option>
          </select>
        </div>
      </div>

      {/* Technical SEO */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="mr-2 text-red-600" />
          SEO Técnico
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="robotsTxt" className="block text-sm font-medium text-gray-700 mb-2">
              Robots.txt
            </label>
            <textarea
              id="robotsTxt"
              name="robotsTxt"
              value={seoData.robotsTxt}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="sitemap" className="block text-sm font-medium text-gray-700 mb-2">
              URL do Sitemap
            </label>
            <input
              type="url"
              id="sitemap"
              name="sitemap"
              value={seoData.sitemap}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* SEO Analysis */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">Análise SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">85/100</div>
            <p className="text-sm text-green-700">Score SEO</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">92/100</div>
            <p className="text-sm text-green-700">Performance</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">88/100</div>
            <p className="text-sm text-green-700">Acessibilidade</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <Save size={20} className="mr-2" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default SEOSettings;