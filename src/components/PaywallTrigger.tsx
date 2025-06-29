import React, { useEffect } from 'react';
import { usePaywall } from '../contexts/PaywallContext';

interface PaywallTriggerProps {
  children: React.ReactNode;
  articleId?: number;
}

const PaywallTrigger: React.FC<PaywallTriggerProps> = ({ children, articleId }) => {
  const { isSubscribed, setShowPaywall } = usePaywall();

  useEffect(() => {
    if (!isSubscribed && articleId) {
      // Mostrar paywall após 3 segundos de leitura
      const timer = setTimeout(() => {
        setShowPaywall(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSubscribed, articleId, setShowPaywall]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isSubscribed) {
      e.preventDefault();
      setShowPaywall(true);
    }
  };

  if (!isSubscribed) {
    return (
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default PaywallTrigger;