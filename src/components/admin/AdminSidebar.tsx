import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Image, 
  Search, 
  Settings, 
  X,
  Globe,
  Shield,
  Bell
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Notícias', path: '/admin/news' },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Image, label: 'Mídia', path: '/admin/media' },
    { icon: Search, label: 'SEO', path: '/admin/seo' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <img 
              src="/20250622_2016_Logo GNN Icônico_simple_compose_01jycytrjmekysntqhf8em8g8f copy.png" 
              alt="Global News Network Logo" 
              className="h-8 w-auto mr-3"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                <span className="text-red-600">Global News Network</span>
              </h2>
              <p className="text-xs text-gray-500">Painel Administrativo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive(item.path)
                        ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                      }
                    `}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 mx-3 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Status do Sistema</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </span>
              <span className="text-gray-500">99.9%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-blue-600">
                <Globe size={12} className="mr-2" />
                CDN
              </span>
              <span className="text-gray-500">Ativo</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-purple-600">
                <Shield size={12} className="mr-2" />
                Segurança
              </span>
              <span className="text-gray-500">OK</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center text-xs text-gray-500">
            <Bell size={14} className="mr-2" />
            <span>Powered by Cloudflare</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;