import React from 'react';

interface AdBannerProps {
  size: string;
  position: string;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size, position, className = "" }) => {
  // Basic placeholder implementation
  return (
    <div className={`ad-banner ${className}`} style={{ width: size.split("x")[0], height: size.split("x")[1] }}>
      <div className="bg-gray-200 dark:bg-gray-700 flex items-center justify-center h-full rounded">
        <span className="text-gray-500 dark:text-gray-400 text-sm">Ad {size} ({position})</span>
      </div>
    </div>
  );
};

export default AdBanner;
