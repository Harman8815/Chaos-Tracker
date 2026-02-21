import React from 'react';

// FIX: Updated component props to accept all standard div attributes, including onClick.
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white/10 dark:bg-gray-800/30 rounded-xl shadow-lg border border-white/20 dark:border-gray-600/30 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:border-accent-primary/50 p-4 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;