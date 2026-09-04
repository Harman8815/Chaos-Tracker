import React from 'react';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.25)] transition-all duration-200 hover:bg-white/[0.05] hover:border-white/20 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;