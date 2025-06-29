import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List,
  Image,
  Video,
  FileText,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import anime from 'animejs';

interface MediaItem {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  uploadDate: string;
  dimensions?: string;
}

const MediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 1,
      name: 'cupula-g20-2024.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=300',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      dimensions: '1920x1080'
    },
    {
      id: 2,
      name: 'tensoes-diplomaticas.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=300',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      dimensions: '1600x900'
    },
    {
      id: 3,
      name: 'uniao-europeia.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/6196984/pexels-photo-6196984.jpeg?auto=compress&cs=tinysrgb&w=300',
      size: '3.1 MB',
      uploadDate: '2024-01-13',
      dimensions: '2048x1152'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    anime({
      targets: '.media-item',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(50),
      easing: 'easeOutQuad'
    });
  }, [mediaItems, viewMode]);

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Simulate file upload
      Array.from(files).forEach((file, index) => {
        const newItem: MediaItem = {
          id: Date.now() + index,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          url: URL.createObjectURL(file),
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        setMediaItems(prev => [newItem, ...prev]);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Mídia</h1>
          <p className="text-gray-600">Gerencie imagens, vídeos e documentos</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center cursor-pointer">
            <Upload size={20} className="mr-2" />
            Upload de Arquivos
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="image">Imagens</option>
              <option value="video">Vídeos</option>
              <option value="document">Documentos</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-red-100 text-red-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-red-100 text-red-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Arquivos ({filteredItems.length})
          </h2>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.map((item, index) => {
              const Icon = getFileIcon(item.type);
              return (
                <div key={item.id} className="media-item group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="text-gray-400" size={32} />
                    </div>
                  )}
                  
                  <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500">{item.size}</p>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button className="p-2 bg-white rounded-lg text-gray-600 hover:text-blue-600 transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-lg text-gray-600 hover:text-green-600 transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-lg text-gray-600 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item, index) => {
              const Icon = getFileIcon(item.type);
              return (
                <div key={item.id} className="media-item flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Icon className="text-gray-400" size={20} />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{item.size}</span>
                        <span>{item.uploadDate}</span>
                        {item.dimensions && <span>{item.dimensions}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Upload size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhum arquivo encontrado
            </h3>
            <p className="text-gray-500">
              Faça upload de arquivos ou ajuste os filtros de busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;