import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, CreditCard, Clock, Check, Zap, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import anime from 'animejs';

const MagaluPromoPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  const product = {
    name: 'Projetor Samsung The Freestyle',
    originalPrice: 3999.00,
    promoPrice: 1999.00,
    discount: 50,
    rating: 4.8,
    reviews: 2847,
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/br/sp-lsbp3buxzd/gallery/br-the-freestyle-sp-lsbp3buxzd-530892018?$650_519_PNG$',
      'https://images.samsung.com/is/image/samsung/p6pim/br/sp-lsbp3buxzd/gallery/br-the-freestyle-sp-lsbp3buxzd-530892019?$650_519_PNG$',
      'https://images.samsung.com/is/image/samsung/p6pim/br/sp-lsbp3buxzd/gallery/br-the-freestyle-sp-lsbp3buxzd-530892020?$650_519_PNG$'
    ],
    features: [
      'Projeção de até 100 polegadas',
      'Resolução Full HD 1080p',
      'Som 360° premium',
      'Ajuste automático de imagem',
      'Streaming integrado (Netflix, Prime Video, Disney+)',
      'Portátil e compacto',
      'Bateria de até 3 horas',
      'Conectividade Wi-Fi e Bluetooth'
    ],
    specifications: {
      'Resolução': 'Full HD 1920x1080',
      'Brilho': '550 ANSI Lumens',
      'Conectividade': 'Wi-Fi, Bluetooth, USB-C, HDMI',
      'Sistema': 'Tizen OS',
      'Peso': '830g',
      'Dimensões': '95.2 x 171.3 x 95.2 mm'
    }
  };

  useEffect(() => {
    anime({
      targets: '.promo-section',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutQuad'
    });

    // Countdown animation
    anime({
      targets: '.countdown-number',
      scale: [1.2, 1],
      duration: 1000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
  }, []);

  const handleBuyNow = () => {
    setShowCheckout(true);
    anime({
      targets: '.checkout-modal',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutQuad'
    });
  };

  const savings = product.originalPrice - product.promoPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Zap size={16} className="animate-pulse" />
            <span>OFERTA RELÂMPAGO - ÚLTIMAS UNIDADES!</span>
            <Zap size={16} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="promo-section">
            <div className="relative">
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}%
                </span>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <Gift size={14} className="mr-1" />
                  FRETE GRÁTIS
                </span>
              </div>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain bg-white rounded-lg shadow-lg"
              />
            </div>
            
            <div className="flex gap-4 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? 'border-red-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain bg-white"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="promo-section">
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                MAGALU QUEIMA DE ESTOQUE
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews.toLocaleString()} avaliações)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  R$ {product.promoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-green-600 font-semibold">
                Você economiza R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                ou 12x de R$ {(product.promoPrice / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Oferta por tempo limitado!</h3>
                  <p className="text-red-600 text-sm">Aproveite antes que acabe</p>
                </div>
                <div className="flex gap-2">
                  <div className="text-center">
                    <div className="countdown-number bg-red-600 text-white px-3 py-2 rounded font-bold">
                      23
                    </div>
                    <div className="text-xs text-red-600 mt-1">HORAS</div>
                  </div>
                  <div className="text-center">
                    <div className="countdown-number bg-red-600 text-white px-3 py-2 rounded font-bold">
                      45
                    </div>
                    <div className="text-xs text-red-600 mt-1">MIN</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Buy Button */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <label className="font-medium text-gray-700">Quantidade:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-green-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <ShoppingCart size={24} />
                COMPRAR AGORA - PIX
              </button>

              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center">
                  <Shield className="text-green-500 mb-1" size={20} />
                  <span className="text-gray-600">Compra Segura</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="text-blue-500 mb-1" size={20} />
                  <span className="text-gray-600">Frete Grátis</span>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="text-purple-500 mb-1" size={20} />
                  <span className="text-gray-600">Entrega Rápida</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Principais Características:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="text-green-500 flex-shrink-0" size={16} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <div className="promo-section bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição do Produto</h2>
            <div className="prose text-gray-700">
              <p className="mb-4">
                O Samsung The Freestyle é um projetor portátil revolucionário que transforma qualquer 
                ambiente em uma experiência de cinema. Com sua tecnologia avançada de projeção e 
                design compacto, você pode levar o entretenimento para qualquer lugar.
              </p>
              <p className="mb-4">
                Equipado com ajuste automático de imagem, o The Freestyle se adapta a qualquer 
                superfície, proporcionando uma imagem perfeita sempre. O som 360° premium garante 
                uma experiência audiovisual completa.
              </p>
              <p>
                Com acesso direto aos principais serviços de streaming e conectividade completa, 
                este projetor é perfeito para apresentações, filmes, jogos e muito mais.
              </p>
            </div>
          </div>

          {/* Specifications */}
          <div className="promo-section bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Especificações Técnicas</h2>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="checkout-modal bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Finalizar Compra</h3>
            
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Produto:</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Quantidade:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold text-red-600">
                  R$ {(product.promoPrice * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <CreditCard size={20} />
                Pagar com PIX
              </button>
              
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              Pagamento seguro e processado em segundos
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagaluPromoPage;