import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
    return (
        <button 
            className={`px-4 py-2 rounded-md font-medium text-text-inverse bg-accent-primary hover:bg-accent-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-background disabled:bg-text-disabled disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;