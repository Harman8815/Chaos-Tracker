import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bg-accent text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-accent-hover disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;