import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';

const Sidebar: React.FC = () => {
  const trendingNews = [
    {
      title: "Eleições nos EUA: últimas pesquisas mostram cenário disputado",
      category: "Política",
      timestamp: "há 2 horas"
    },
    {
      title: "União Europeia anuncia novas sanções econômicas",
      category: "Economia",
      timestamp: "há 3 horas"
    },
    {
      title: "Acordo climático: países chegam a consenso na COP",
      category: "Meio Ambiente",
      timestamp: "há 4 horas"
    },
    {
      title: "Conflito no Leste Europeu entra em nova fase",
      category: "Internacional",
      timestamp: "há 5 horas"
    }
  ];

  const mostRead = [
    "China anuncia nova política econômica para 2024",
    "Presidente brasileiro participa de cúpula internacional",
    "Mercados asiáticos registram alta histórica",
    "Nova descoberta científica revoluciona medicina",
    "Acordo comercial entre Brasil e União Europeia"
  ];

  return (
    <aside className="space-y-8">
      {/* Trending News */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="flex items-center text-xl font-bold text-gray-900 mb-6">
          <TrendingUp className="mr-2 text-red-600" size={24} />
          Mais Lidas
        </h3>
        <div className="space-y-4">
          {trendingNews.map((news, index) => (
            <article key={index} className="group cursor-pointer pb-4 border-b border-gray-100 last:border-b-0">
              <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2 leading-snug">
                {news.title}
              </h4>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                  {news.category}
                </span>
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {news.timestamp}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Most Read */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Mais Lidas da Semana
        </h3>
        <ol className="space-y-3">
          {mostRead.map((title, index) => (
            <li key={index} className="flex items-start group cursor-pointer">
              <span className="bg-red-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-gray-700 group-hover:text-red-600 transition-colors font-medium leading-snug">
                {title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Advertisement placeholder */}
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500 font-medium">Publicidade</p>
        <div className="mt-4 h-48 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-400">300x250</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;