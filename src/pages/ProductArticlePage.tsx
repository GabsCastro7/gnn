import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PurchaseModal from '../components/PurchaseModal';

const ProductArticlePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = {
    name: 'Projetor Samsung The Freestyle com 50% de Desconto',
    price: '1.999,00',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/br/sp-lsbp3buxzd/gallery/br-the-freestyle-sp-lsbp3buxzd-530892018?$650_519_PNG$',
    description: 'Aproveite a queima de estoque da Magalu e adquira o projetor Samsung The Freestyle com um desconto imperdível de 50%. Leve o cinema para qualquer lugar com este dispositivo portátil, com ajuste de imagem automático, som premium 360° e acesso a todos os seus apps de streaming favoritos. A oferta é por tempo limitado e o pagamento pode ser feito via PIX de forma rápida e segura.'
  };

  const simulatedPixData = {
    qrCodeValue: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913NOME DO LOJISTA6008BRASILIA62070503***6304E2A3',
    copyPasteValue: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913NOME DO LOJISTA6008BRASILIA62070503***6304E2A3',
    amount: product.price,
  };

  const handlePayment = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 mb-8">
            <ArrowLeft size={14} className="mr-1" />
            Voltar para a Home
          </Link>

          <article>
            <header className="mb-8">
              <p className="text-red-600 dark:text-red-500 font-semibold">OFERTA ESPECIAL</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">{product.name}</h1>
            </header>

            <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow-lg mb-8" />

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-gray-600 dark:text-gray-300">Preço promocional:</p>
                <p className="text-4xl font-bold text-red-600 dark:text-red-500">R$ {product.price}</p>
              </div>
              <button 
                onClick={handlePayment}
                className="w-full md:w-auto flex items-center justify-center bg-green-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-600 transition-all duration-300 text-lg shadow-lg"
              >
                <ShoppingCart className="mr-3" />
                Pagar com PIX
              </button>
            </div>
          </article>
        </div>
      </div>

      <PurchaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pixData={simulatedPixData} 
      />
    </>
  );
};

export default ProductArticlePage;
