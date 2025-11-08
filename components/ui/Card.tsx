import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-light-secondary dark:bg-secondary p-6 rounded-xl border border-light-border-color dark:border-border-color shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;