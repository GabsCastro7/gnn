import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Briefcase } from 'lucide-react';
import anime from 'animejs';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    department: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    anime({
      targets: '.contact-section',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutQuad'
    });
  }, []);

  const departments = [
    { value: '', label: 'Selecione um departamento' },
    { value: 'redacao', label: 'Redação' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'suporte', label: 'Suporte Técnico' },
    { value: 'rh', label: 'Recursos Humanos' },
    { value: 'juridico', label: 'Jurídico' },
    { value: 'outros', label: 'Outros' }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Geral",
      info: "contato@gnn.com.br",
      description: "Para dúvidas gerais e informações"
    },
    {
      icon: Phone,
      title: "Telefone",
      info: "+55 11 3000-0000",
      description: "Atendimento de segunda a sexta, 9h às 18h"
    },
    {
      icon: MapPin,
      title: "Endereço",
      info: "Av. Paulista, 1000 - São Paulo, SP",
      description: "CEP: 01310-100"
    },
    {
      icon: Clock,
      title: "Horário de Funcionamento",
      info: "24/7 Redação | 9h-18h Administrativo",
      description: "Nossa redação funciona 24 horas por dia"
    }
  ];

  const specificContacts = [
    {
      icon: MessageCircle,
      title: "Redação",
      email: "redacao@gnn.com.br",
      phone: "+55 11 3000-0001",
      description: "Para sugestões de pauta, denúncias e informações jornalísticas"
    },
    {
      icon: Briefcase,
      title: "Comercial",
      email: "comercial@gnn.com.br",
      phone: "+55 11 3000-0002",
      description: "Para parcerias, publicidade e oportunidades comerciais"
    },
    {
      icon: Users,
      title: "Recursos Humanos",
      email: "rh@gnn.com.br",
      phone: "+55 11 3000-0003",
      description: "Para oportunidades de carreira e questões trabalhistas"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        department: '',
        message: ''
      });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="contact-section text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Estamos aqui para ouvir você. Entre em contato conosco para dúvidas, 
              sugestões ou oportunidades de colaboração.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="contact-section bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-red-600 font-semibold mb-2">{info.info}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="contact-section">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Envie sua Mensagem
                </h2>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="success-message bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <Send className="text-green-600" size={16} />
                      </div>
                      <div>
                        <h4 className="text-green-800 font-semibold">Mensagem Enviada!</h4>
                        <p className="text-green-700 text-sm">
                          Obrigado pelo contato. Responderemos em breve.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        {departments.map(dept => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Assunto *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Assunto da mensagem"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Digite sua mensagem aqui..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Specific Contacts */}
            <div className="contact-section space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contatos Específicos
              </h2>

              {specificContacts.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start">
                      <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon className="text-red-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
                        <p className="text-gray-600 mb-3 text-sm">{contact.description}</p>
                        <div className="space-y-1">
                          <p className="text-red-600 font-medium">{contact.email}</p>
                          <p className="text-gray-700">{contact.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Map placeholder */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Nossa Localização</h3>
                <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p>Mapa Interativo</p>
                    <p className="text-sm">Av. Paulista, 1000 - São Paulo, SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;