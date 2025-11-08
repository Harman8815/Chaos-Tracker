import React from 'react';

interface TrackerWrapperProps {
  title: string;
  // fix: Use React.ReactElement to resolve issue with JSX namespace.
  icon: React.ReactElement;
  children: React.ReactNode;
}

const TrackerWrapper: React.FC<TrackerWrapperProps> = ({ title, icon, children }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="text-accent">{React.cloneElement(icon, { width: 32, height: 32 })}</div>
        <h1 className="text-3xl font-bold text-text-primary ml-4">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default TrackerWrapper;
