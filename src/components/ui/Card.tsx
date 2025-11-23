import React from 'react';

// FIX: Updated component props to accept all standard div attributes, including onClick.
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`bg-card-bg p-6 rounded-xl shadow-lg border border-border transition-all duration-300 hover:shadow-2xl hover:border-accent-primary/50 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;