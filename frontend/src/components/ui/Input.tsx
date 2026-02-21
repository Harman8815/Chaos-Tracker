import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 bg-input-bg border border-input-border rounded-md text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors duration-200 ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;
