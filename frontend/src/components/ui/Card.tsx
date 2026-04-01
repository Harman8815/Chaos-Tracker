import React from 'react';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-card-bg border border-border rounded-lg shadow-subtle hover:shadow-md transition-shadow duration-200 p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;