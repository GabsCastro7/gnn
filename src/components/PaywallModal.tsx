import React, { useState, useEffect } from 'react';
import { X, CreditCard, Shield, Check, Star, Clock, Users } from 'lucide-react';
import anime from 'animejs';
import { usePaywall } from '../contexts/PaywallContext';

const PaywallModal: React.FC = () => {
  const { showPaywall, setShowPaywall, subscribe } = usePaywall();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'pix'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (showPaywall) {
      anime({
        targets: '.paywall-modal',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuad'
      });

      anime({
        targets: '.paywall-content',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        delay: 200,
        easing: 'easeOutQuad'
      });
    }
  }, [showPaywall]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    subscribe(selectedPlan);
    setIsProcessing(false);
    setShowPaymentForm(false);
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Mensal',
      price: 29.90,
      period: 'mês',
      savings: null,
      popular: false
    },
    {
      id: 'annual',
      name: 'Anual',
      price: 299.90,
      period: 'ano',
      savings: 'Economize R$ 58,90',
      popular: true
    }
  ];

  const benefits = [
    'Acesso ilimitado a todas as notícias',
    'Conteúdo exclusivo e análises aprofundadas',
    'Newsletter premium diária',
    'Sem anúncios',
    'Acesso prioritário a eventos ao vivo',
    'Arquivo completo de notícias',
    'Suporte premium 24/7'
  ];

  if (!showPaywall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="paywall-modal bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-t-2xl">
          <button
            onClick={() => setShowPaywall(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="paywall-content text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Jornalismo de Qualidade
            </h2>
            <p className="text-red-100 text-lg">
              Tenha acesso completo às melhores notícias internacionais
            </p>
          </div>
        </div>

        <div className="p-8">
          {!showPaymentForm ? (
            <>
              {/* Plans */}
              <div className="paywall-content mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                  Escolha seu plano
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id as 'monthly' | 'annual')}
                      className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                            <Star size={14} className="mr-1" />
                            Mais Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {plan.name}
                        </h4>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-red-600">
                            R$ {plan.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            /{plan.period}
                          </span>
                        </div>
                        {plan.savings && (
                          <p className="text-green-600 font-semibold text-sm">
                            {plan.savings}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="paywall-content mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  O que você terá acesso:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="text-green-500 mr-3 flex-shrink-0" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="paywall-content bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600 mb-1">50K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Assinantes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cobertura</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600 mb-1">150+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Países</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="paywall-content text-center">
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors w-full md:w-auto"
                >
                  Continuar para Pagamento
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Cancele a qualquer momento • Garantia de 7 dias
                </p>
              </div>
            </>
          ) : (
            /* Payment Form */
            <div className="paywall-content">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  ←
                </button>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Finalizar Pagamento
                </h3>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resumo do Pedido</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Plano {selectedPlan === 'monthly' ? 'Mensal' : 'Anual'}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    R$ {selectedPlan === 'monthly' ? '29,90' : '299,90'}
                  </span>
                </div>
                {selectedPlan === 'annual' && (
                  <div className="text-sm text-green-600 mb-2">
                    Economia de R$ 58,90 no plano anual
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-red-600">
                      R$ {selectedPlan === 'monthly' ? '29,90' : '299,90'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Método de Pagamento</h4>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                    }`}
                  >
                    <CreditCard className="mx-auto mb-2 text-gray-600" size={24} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Cartão</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                    }`}
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">PayPal</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                    }`}
                  >
                    <div className="w-6 h-6 bg-green-600 rounded mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">PIX</span>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Validade
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="João Silva"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">PP</span>
                  </div>
                  <p className="text-blue-800 dark:text-blue-200 mb-4">
                    Você será redirecionado para o PayPal para completar o pagamento
                  </p>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 text-center">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-500 text-sm">QR Code PIX</span>
                  </div>
                  <p className="text-green-800 dark:text-green-200 mb-2">
                    Escaneie o QR Code com seu app do banco
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Pagamento instantâneo via PIX
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  `Pagar R$ ${selectedPlan === 'monthly' ? '29,90' : '299,90'}`
                )}
              </button>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <Shield size={16} className="mr-2" />
                  Pagamento 100% seguro e criptografado
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;