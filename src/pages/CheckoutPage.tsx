import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PurchaseModal from '../components/PurchaseModal';

const CheckoutPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const product = {
    name: 'Projetor Samsung The Freestyle com 50% de Desconto',
    price: '1.999,00',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/br/sp-lsbp3buxzd/gallery/br-the-freestyle-sp-lsbp3buxzd-530892018?$650_519_PNG$'
  };

  // This data would come from your backend after calling pursa.co API
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Product Image and Details */}
          <div className="flex flex-col items-center">
            <img src={product.imageUrl} alt={product.name} className="w-full max-w-sm rounded-lg mb-6" />
            <Link to="/" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-600">
              <ArrowLeft size={14} className="mr-1" />
              Voltar para a loja
            </Link>
          </div>

          {/* Order Summary and Payment */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Finalize sua Compra</h1>
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Produto:</span>
                <span className="font-semibold text-gray-800 dark:text-white text-right">{product.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="font-semibold text-gray-800 dark:text-white">R$ {product.price}</span>
              </div>
            </div>
            <div className="text-right mb-6">
              <p className="text-gray-600 dark:text-gray-300">Total a pagar:</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-500">R$ {product.price}</p>
            </div>
            
            <button 
              onClick={handlePayment}
              className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 transition-all duration-300 text-lg shadow-lg"
            >
              Pagar com PIX
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">Pagamento seguro e processado em segundos.</p>
          </div>
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

export default CheckoutPage;
