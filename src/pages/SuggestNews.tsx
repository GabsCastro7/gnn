import React, { useState, useEffect } from 'react';
import { Send, Upload, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';
import anime from 'animejs';

const SuggestNews: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: '',
    category: '',
    urgency: 'normal',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    additionalInfo: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = [
    { value: '', label: 'Selecione uma categoria' },
    { value: 'internacional', label: 'Internacional' },
    { value: 'politica', label: 'Política' },
    { value: 'economia', label: 'Economia' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'saude', label: 'Saúde' },
    { value: 'meio-ambiente', label: 'Meio Ambiente' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'cultura', label: 'Cultura' },
    { value: 'outros', label: 'Outros' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Baixa', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'Alta', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgente', color: 'text-red-600' }
  ];

  useEffect(() => {
    anime({
      targets: '.form-section',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutQuad'
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        source: '',
        category: '',
        urgency: 'normal',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        additionalInfo: ''
      });
      setFiles([]);

      // Animate success message
      anime({
        targets: '.success-message',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .8)'
      });

    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="form-section text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sugira uma <span className="text-red-600">Notícia</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tem uma notícia importante? Compartilhe conosco! Nossa equipe de jornalistas irá analisar e verificar todas as sugestões.
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="success-message bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Sugestão Enviada com Sucesso!</h3>
                <p className="text-green-700">
                  Obrigado por sua contribuição. Nossa equipe irá analisar sua sugestão e entrar em contato se necessário.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Erro ao Enviar</h3>
                <p className="text-red-700">
                  Ocorreu um erro ao enviar sua sugestão. Tente novamente ou entre em contato conosco.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* News Information */}
          <div className="form-section mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <LinkIcon className="mr-2 text-red-600" />
              Informações da Notícia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Notícia *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Digite o título da notícia"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da Notícia *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Descreva os detalhes da notícia, incluindo fatos, datas, locais e pessoas envolvidas"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                  Fonte da Informação
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: Site oficial, jornal, testemunha, etc."
                />
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Urgência
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informações de Contato
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="form-section mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="mr-2 text-red-600" />
              Anexos (Opcional)
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Selecionar Arquivos
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Formatos aceitos: Imagens, vídeos, PDF, DOC (máx. 10MB cada)
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Arquivos selecionados:</h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="text-green-500 mr-2" size={16} />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="form-section mb-8">
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
              Informações Adicionais
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Qualquer informação adicional que possa ser relevante para a notícia"
            />
          </div>

          {/* Submit Button */}
          <div className="form-section text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-3" size={20} />
                  Enviar Sugestão
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Importante:</strong> Todas as sugestões são analisadas por nossa equipe editorial. 
              Nos reservamos o direito de verificar a veracidade das informações antes da publicação. 
              Informações falsas ou enganosas não serão publicadas.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestNews;