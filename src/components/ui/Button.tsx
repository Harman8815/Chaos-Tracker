import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
    return (
        <button 
            className={`px-5 py-2.5 rounded-lg font-semibold text-white bg-accent-primary hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-background disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;