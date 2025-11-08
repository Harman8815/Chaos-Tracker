import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
    return (
        <button 
            className={`px-4 py-2 rounded-md font-semibold text-white bg-accent-primary hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
