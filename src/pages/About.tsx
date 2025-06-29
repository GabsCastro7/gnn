import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, Award, Target, Heart, Shield, Mail, Briefcase } from 'lucide-react';
import anime from 'animejs';

const About: React.FC = () => {
  useEffect(() => {
    anime({
      targets: '.about-section',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutQuad'
    });

    anime({
      targets: '.team-card',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100, {start: 600}),
      easing: 'easeOutQuad'
    });
  }, []);

  const values = [
    {
      icon: Shield,
      title: "Credibilidade",
      description: "Compromisso com a verdade e verificação rigorosa de fatos"
    },
    {
      icon: Globe,
      title: "Alcance Global",
      description: "Cobertura internacional com perspectiva local"
    },
    {
      icon: Users,
      title: "Diversidade",
      description: "Equipe multicultural com diferentes perspectivas"
    },
    {
      icon: Target,
      title: "Precisão",
      description: "Informação precisa e contextualizada"
    },
    {
      icon: Heart,
      title: "Impacto Social",
      description: "Jornalismo que faz a diferença na sociedade"
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Padrão internacional de qualidade jornalística"
    }
  ];

  const team = [
    {
      name: "Maria Silva",
      role: "Editora-Chefe",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "15 anos de experiência em jornalismo internacional"
    },
    {
      name: "João Santos",
      role: "Correspondente Internacional",
      image: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Especialista em política internacional e diplomacia"
    },
    {
      name: "Ana Costa",
      role: "Editora de Economia",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Mestre em Economia Internacional pela USP"
    },
    {
      name: "Carlos Oliveira",
      role: "Editor de Tecnologia",
      image: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Especialista em inovação e tecnologia global"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="about-section text-center">
            <img 
              src="/20250622_2016_Logo GNN Icônico_simple_compose_01jycytrjmekysntqhf8em8g8f copy.png" 
              alt="Global News Network Logo" 
              className="h-20 w-auto mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Global News Network
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Conectando o mundo através do jornalismo de qualidade, 
              levando informação confiável a todos os cantos do planeta.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="about-section text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa Missão
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              A Global News Network nasceu com o propósito de democratizar o acesso à informação internacional de qualidade. 
              Acreditamos que um mundo mais conectado e informado é um mundo melhor. Nossa missão é fornecer 
              cobertura jornalística imparcial, precisa e relevante dos principais acontecimentos globais.
            </p>
          </div>

          {/* Stats */}
          <div className="about-section grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">150+</div>
              <div className="text-gray-600 dark:text-gray-400">Países Cobertos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Cobertura Contínua</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Jornalistas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">1M+</div>
              <div className="text-gray-600 dark:text-gray-400">Leitores Mensais</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="about-section text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Os princípios que guiam nosso trabalho e definem nossa identidade jornalística.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="about-section text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-red-600 dark:text-red-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="about-section text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Profissionais experientes e apaixonados por jornalismo, 
              dedicados a trazer as melhores notícias para você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="team-card bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                  <p className="text-red-600 dark:text-red-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="about-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Nossa História
                </h2>
                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                  <p>
                    A Global News Network foi fundada em 2020 com a visão de criar uma ponte entre as notícias 
                    internacionais e o público brasileiro. Começamos como uma pequena equipe de 
                    jornalistas apaixonados por contar histórias que importam.
                  </p>
                  <p>
                    Em poucos anos, crescemos para nos tornar uma das principais fontes de 
                    notícias internacionais no Brasil, com correspondentes em todos os continentes 
                    e uma rede de colaboradores especializados.
                  </p>
                  <p>
                    Hoje, a Global News Network é reconhecida pela qualidade de sua cobertura jornalística, 
                    pela rapidez na entrega de informações e pelo compromisso com a verdade 
                    e a imparcialidade.
                  </p>
                </div>
              </div>
              <div className="about-section">
                <img
                  src="https://images.pexels.com/photos/6193518/pexels-photo-6193518.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Newsroom GNN"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="about-section">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Quer Fazer Parte da Nossa História?
            </h2>
            <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
              Estamos sempre em busca de talentos apaixonados por jornalismo. 
              Entre em contato conosco e descubra as oportunidades disponíveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Mail size={20} className="mr-2" />
                Entre em Contato
              </Link>
              <a
                href="mailto:rh@gnn.com.br"
                className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                <Briefcase size={20} className="mr-2" />
                Trabalhe Conosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;