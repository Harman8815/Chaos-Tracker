import React, { useContext } from 'react';
// FIX: Corrected import paths for context and types.
import { SettingsContext } from '../App';
import { Theme, TimeFormat, Language } from '../types';

const SettingsModal: React.FC = () => {
    const { settings, setSettings, setIsSettingsModalOpen } = useContext(SettingsContext);

    const handleThemeChange = (theme: Theme) => {
        setSettings(s => ({ ...s, theme }));
    };

    const handleTimeFormatChange = (format: TimeFormat) => {
        setSettings(s => ({ ...s, timeFormat: format }));
    };
    
    const handleLanguageChange = (lang: Language) => {
        setSettings(s => ({...s, language: lang }));
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
            onClick={() => setIsSettingsModalOpen(false)}
        >
            <div 
                className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Settings</h2>
                
                {/* Theme Setting */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Theme</label>
                    <div className="flex space-x-2">
                        {(['light', 'dark'] as Theme[]).map(theme => (
                            <button
                                key={theme}
                                onClick={() => handleThemeChange(theme)}
                                className={`w-full py-2 rounded-md text-sm capitalize transition-colors ${settings.theme === theme ? 'bg-accent-primary text-white' : 'bg-input-bg hover:bg-border'}`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Format Setting */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Time Format</label>
                    <div className="flex space-x-2">
                         {(['12h', '24h'] as TimeFormat[]).map(format => (
                            <button
                                key={format}
                                onClick={() => handleTimeFormatChange(format)}
                                className={`w-full py-2 rounded-md text-sm ${settings.timeFormat === format ? 'bg-accent-primary text-white' : 'bg-input-bg hover:bg-border'}`}
                            >
                                {format === '12h' ? '12-Hour' : '24-Hour'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Setting */}
                 <div className="mb-8">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Language (UI Only)</label>
                    <select
                        value={settings.language}
                        onChange={(e) => handleLanguageChange(e.target.value as Language)}
                        className="w-full p-2 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                    </select>
                </div>

                <button
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="w-full py-2 rounded-md font-semibold text-white bg-accent-primary hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;