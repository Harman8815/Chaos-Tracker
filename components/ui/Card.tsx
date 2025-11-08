import React from 'react';

// FIX: Updated component props to accept all standard div attributes, including onClick.
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`bg-card-bg p-6 rounded-xl shadow-md ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
