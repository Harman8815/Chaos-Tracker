import React from 'react';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-[rgba(15,10,30,0.75)] backdrop-blur-xl border border-[rgba(139,92,246,0.35)] rounded-lg shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all duration-200 p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;