import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Bell,
  Save,
  Upload,
  Palette,
  Database
} from 'lucide-react';

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'GNN - Global News Network',
    siteUrl: 'https://gnn.com.br',
    adminEmail: 'admin@gnn.com.br',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    postsPerPage: 10,
    commentsEnabled: true,
    registrationEnabled: false,
    maintenanceMode: false,
    emailNotifications: true,
    pushNotifications: true,
    analyticsCode: '',
    customCSS: '',
    footerText: '© 2024 GNN - Global News Network. Todos os direitos reservados.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações Gerais</h1>
        <p className="text-gray-600">Configure as opções básicas do sistema</p>
      </div>

      {/* Site Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Globe className="mr-2 text-red-600" />
          Configurações do Site
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL do Site
            </label>
            <input
              type="url"
              id="siteUrl"
              name="siteUrl"
              value={settings.siteUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email do Administrador
            </label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select
              id="timezone"
              name="timezone"
              value={settings.timezone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/New_York">Nova York (GMT-5)</option>
              <option value="Europe/London">Londres (GMT+0)</option>
              <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Settings className="mr-2 text-red-600" />
          Localização
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Data
            </label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Hora
            </label>
            <select
              id="timeFormat"
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="24h">24 horas</option>
              <option value="12h">12 horas (AM/PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Database className="mr-2 text-red-600" />
          Configurações de Conteúdo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="postsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
              Posts por Página
            </label>
            <input
              type="number"
              id="postsPerPage"
              name="postsPerPage"
              value={settings.postsPerPage}
              onChange={handleInputChange}
              min="1"
              max="50"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="commentsEnabled"
                name="commentsEnabled"
                checked={settings.commentsEnabled}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="commentsEnabled" className="ml-2 block text-sm text-gray-700">
                Habilitar comentários
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="registrationEnabled"
                name="registrationEnabled"
                checked={settings.registrationEnabled}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="registrationEnabled" className="ml-2 block text-sm text-gray-700">
                Permitir registro de usuários
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                Modo de manutenção
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Bell className="mr-2 text-red-600" />
          Notificações
        </h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
              Notificações por email
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="pushNotifications"
              name="pushNotifications"
              checked={settings.pushNotifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
              Notificações push
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="mr-2 text-red-600" />
          Configurações Avançadas
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="analyticsCode" className="block text-sm font-medium text-gray-700 mb-2">
              Código do Google Analytics
            </label>
            <input
              type="text"
              id="analyticsCode"
              name="analyticsCode"
              value={settings.analyticsCode}
              onChange={handleInputChange}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="customCSS" className="block text-sm font-medium text-gray-700 mb-2">
              CSS Personalizado
            </label>
            <textarea
              id="customCSS"
              name="customCSS"
              value={settings.customCSS}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
              placeholder="/* Adicione seu CSS personalizado aqui */"
            />
          </div>

          <div>
            <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-2">
              Texto do Rodapé
            </label>
            <input
              type="text"
              id="footerText"
              name="footerText"
              value={settings.footerText}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
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

export default GeneralSettings;