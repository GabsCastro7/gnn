import React, { createContext, useContext, useState, useEffect } from 'react';

interface PaywallContextType {
  isSubscribed: boolean;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  subscribe: (plan: 'monthly' | 'annual') => void;
  checkSubscription: () => boolean;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export const PaywallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já é assinante
    const subscription = localStorage.getItem('gnn_subscription');
    if (subscription) {
      const subscriptionData = JSON.parse(subscription);
      const expiryDate = new Date(subscriptionData.expiryDate);
      const now = new Date();
      
      if (expiryDate > now) {
        setIsSubscribed(true);
      } else {
        localStorage.removeItem('gnn_subscription');
      }
    }
  }, []);

  const subscribe = (plan: 'monthly' | 'annual') => {
    const now = new Date();
    const expiryDate = new Date();
    
    if (plan === 'monthly') {
      expiryDate.setMonth(now.getMonth() + 1);
    } else {
      expiryDate.setFullYear(now.getFullYear() + 1);
    }

    const subscriptionData = {
      plan,
      startDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      price: plan === 'monthly' ? 29.90 : 299.90
    };

    localStorage.setItem('gnn_subscription', JSON.stringify(subscriptionData));
    setIsSubscribed(true);
    setShowPaywall(false);
  };

  const checkSubscription = () => {
    return isSubscribed;
  };

  return (
    <PaywallContext.Provider value={{
      isSubscribed,
      showPaywall,
      setShowPaywall,
      subscribe,
      checkSubscription
    }}>
      {children}
    </PaywallContext.Provider>
  );
};

export const usePaywall = () => {
  const context = useContext(PaywallContext);
  if (context === undefined) {
    throw new Error('usePaywall must be used within a PaywallProvider');
  }
  return context;
};