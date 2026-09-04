import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] rounded-md text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-colors duration-200 ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;
