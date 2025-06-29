import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: {
    qrCodeValue: string;
    copyPasteValue: string;
    amount: string;
  };
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, pixData }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixData.copyPasteValue);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full m-4 relative animate-fade-in-up">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pague com PIX</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Para finalizar, escaneie o QR Code ou copie o código.</p>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200 inline-block">
                <QRCode value={pixData.qrCodeValue} size={200} />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total: <span className='text-green-500'>R$ {pixData.amount}</span></p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Clique para copiar o código PIX:</p>
          <div className="relative">
            <input 
              type="text" 
              readOnly 
              value={pixData.copyPasteValue} 
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-12 text-sm text-gray-700 dark:text-gray-300 truncate"
            />
            <button 
              onClick={handleCopy}
              className="absolute inset-y-0 right-0 flex items-center px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              {isCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>Após o pagamento, a confirmação é automática.</p>
          <p>O QR Code expira em 5 minutos.</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
