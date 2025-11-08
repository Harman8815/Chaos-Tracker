import React, { useContext } from 'react';
import { SettingsContext } from '../App';
import type { Theme, TimeFormat, Language } from '../types';

const SettingsModal: React.FC = () => {
  const context = useContext(SettingsContext);
  if (!context) return null;

  const { isSettingsOpen, setIsSettingsOpen, settings, setSettings } = context;

  if (!isSettingsOpen) return null;

  const handleThemeChange = (theme: Theme) => {
    setSettings(s => ({ ...s, theme }));
  };

  const handleTimeFormatChange = (timeFormat: TimeFormat) => {
    setSettings(s => ({ ...s, timeFormat }));
  };
  
  const handleLanguageChange = (language: Language) => {
    setSettings(s => ({ ...s, language }));
  };

  const SettingRow: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-light-border-color dark:border-border-color flex justify-between items-center">
        <h3 className="font-semibold text-light-text-primary dark:text-text-primary">{title}</h3>
        <div className="flex space-x-2">{children}</div>
    </div>
  );

  const OptionButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode; }> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            isActive 
            ? 'bg-accent text-white' 
            : 'bg-light-primary dark:bg-primary hover:bg-light-border-color dark:hover:bg-border-color'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center animate-fadeIn"
        onClick={() => setIsSettingsOpen(false)}
    >
      <div 
        className="bg-light-secondary dark:bg-secondary p-6 rounded-xl shadow-2xl w-full max-w-sm border border-light-border-color dark:border-border-color"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-light-text-primary dark:text-text-primary">Settings</h2>
            <button onClick={() => setIsSettingsOpen(false)} className="text-light-text-secondary dark:text-text-secondary hover:text-light-text-primary dark:hover:text-text-primary">&times;</button>
        </div>
        
        <div className="flex flex-col">
            <SettingRow title="Theme">
                <OptionButton onClick={() => handleThemeChange('light')} isActive={settings.theme === 'light'}>Light</OptionButton>
                <OptionButton onClick={() => handleThemeChange('dark')} isActive={settings.theme === 'dark'}>Dark</OptionButton>
            </SettingRow>
            <SettingRow title="Time Format">
                <OptionButton onClick={() => handleTimeFormatChange('12h')} isActive={settings.timeFormat === '12h'}>12-hour</OptionButton>
                <OptionButton onClick={() => handleTimeFormatChange('24h')} isActive={settings.timeFormat === '24h'}>24-hour</OptionButton>
            </SettingRow>
            <SettingRow title="Language">
                <OptionButton onClick={() => handleLanguageChange('en')} isActive={settings.language === 'en'}>English</OptionButton>
                <OptionButton onClick={() => handleLanguageChange('es')} isActive={settings.language === 'es'}>Español</OptionButton>
                <OptionButton onClick={() => handleLanguageChange('de')} isActive={settings.language === 'de'}>Deutsch</OptionButton>
            </SettingRow>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="bg-accent text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 hover:bg-accent-hover"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;