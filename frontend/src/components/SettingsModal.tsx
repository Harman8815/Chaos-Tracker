import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { SettingsContext } from '../context/SettingsContext';
import { Theme, TimeFormat, Language } from '../types';

const SettingsModal: React.FC = () => {
    const { settings, setSettings, setIsSettingsModalOpen, t } = useContext(SettingsContext);
    const { logout } = useContext(DataContext);

    const handleThemeChange = (theme: Theme) => {
        setSettings(s => ({ ...s, theme }));
    };

    const handleTimeFormatChange = (format: TimeFormat) => {
        setSettings(s => ({ ...s, timeFormat: format }));
    };

    const handleLanguageChange = (lang: Language) => {
        setSettings(s => ({ ...s, language: lang }));
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fade-in"
            onClick={() => setIsSettingsModalOpen(false)}
        >
            <div
                className="bg-[rgba(15,10,30,0.75)] backdrop-blur-xl border border-[rgba(139,92,246,0.35)] rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.35)] w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-white">{t('settings')}</h2>

                {/* Theme Setting */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#e9d5ff] mb-2">{t('Theme')}</label>
                    <div className="flex space-x-2">
                        {(['light', 'dark'] as Theme[]).map(theme => (
                            <button
                                key={theme}
                                onClick={() => handleThemeChange(theme)}
                                className={`w-full py-2 rounded-md text-sm capitalize transition-colors ${settings.theme === theme ? 'bg-[#8b5cf6] text-white' : 'bg-[rgba(15,10,30,0.6)] hover:bg-[rgba(139,92,246,0.35)]'}`}
                            >
                                {t(theme)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Format Setting */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#e9d5ff] mb-2">{t('Time Format')}</label>
                    <div className="flex space-x-2">
                        {(['12h', '24h'] as TimeFormat[]).map(format => (
                            <button
                                key={format}
                                onClick={() => handleTimeFormatChange(format)}
                                className={`w-full py-2 rounded-md text-sm ${settings.timeFormat === format ? 'bg-[#8b5cf6] text-white' : 'bg-[rgba(15,10,30,0.6)] hover:bg-[rgba(139,92,246,0.35)]'}`}
                            >
                                {format === '12h' ? t('12-Hour') : t('24-Hour')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Setting */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-[#e9d5ff] mb-2">{t('Language (UI Only)')}</label>
                    <select
                        value={settings.language}
                        onChange={(e) => handleLanguageChange(e.target.value as Language)}
                        className="w-full p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                    >
                        <option value="en">{t('English')}</option>
                        <option value="es">{t('Español')}</option>
                        <option value="fr">{t('Français')}</option>
                    </select>
                </div>

                {/* Debug Actions */}
                <div className="mb-6 pt-4 border-t border-[rgba(139,92,246,0.35)]">
                    <label className="block text-sm font-medium text-[#e9d5ff] mb-2">Debug Actions</label>
                    <button
                        onClick={async () => {
                            if (confirm('This will generate dummy data for expenses, goals, etc. Continue?')) {
                                try {
                                    const { client } = await import('../api/client');
                                    await client.get('/populate-data/');
                                    alert('Data populated successfully! Please refresh the page.');
                                    window.location.reload();
                                } catch (error) {
                                    alert('Failed to populate data.');
                                    console.error(error);
                                }
                            }
                        }}
                        className="w-full py-2 rounded-md text-sm font-semibold text-[#8b5cf6] bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 transition-colors"
                    >
                        Populate Dummy Data
                    </button>
                </div>

                <button
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="w-full py-2 rounded-md font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b5cf6] mb-4"
                >
                    {t('Close')}
                </button>

                <div className="pt-4 border-t border-[rgba(139,92,246,0.35)]">
                    <button
                        onClick={() => {
                            setIsSettingsModalOpen(false);
                            logout();
                        }}
                        className="w-full py-2 rounded-md font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors focus:outline-none"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
