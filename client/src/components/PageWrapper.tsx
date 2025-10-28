import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => {
  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={{
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      {children}
    </div>
  );
};
