import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { authService, TempDataResponse } from '../../api/authService';

interface LoginPageProps {
    onLogin: () => void;
    onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignUp }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPopulatingData, setIsPopulatingData] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await authService.login({ username, password });

            if (response.success && response.user) {
                // Store user data in local storage or context
                localStorage.setItem('user', JSON.stringify(response.user));
                onLogin();
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePopulateTestData = async () => {
        setIsPopulatingData(true);
        setError('');
        setSuccessMessage('');

        try {
            const response: TempDataResponse = await authService.populateTempData();
            
            if (response.success) {
                setSuccessMessage(
                    `Test data populated successfully! Created: ${response.data?.expenses || 0} expenses, ${response.data?.goals || 0} goals, ${response.data?.habits || 0} habits, and ${response.data?.journal_entries || 0} journal entries for the past 12 months.`
                );
            } else {
                setError(response.error || 'Failed to populate test data');
            }
        } catch (err) {
            setError('An unexpected error occurred while populating test data.');
        } finally {
            setIsPopulatingData(false);
        }
    };

    return (
        <div className="w-full max-w-md px-4 animate-fade-in relative z-10">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-[#8b5cf6] mb-2 tracking-tight">Tracker</h1>
                <p className="text-[#e9d5ff] text-lg">Your daily companion for growth.</p>
            </div>
            
            {/* Demo Credentials Box */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-[rgba(139,92,246,0.35)] rounded-lg">
                <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">💡</span>
                    <h3 className="text-sm font-semibold text-blue-300">Demo Credentials</h3>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-medium">Username:</span>
                        <code className="bg-blue-900/30 px-2 py-0.5 rounded text-blue-300 font-mono">admin</code>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-medium">Password:</span>
                        <code className="bg-blue-900/30 px-2 py-0.5 rounded text-blue-300 font-mono">Admin@123</code>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        setUsername('admin');
                        setPassword('Admin@123');
                    }}
                    className="mt-3 w-full text-xs bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded transition-colors duration-200"
                >
                    🚀 Auto-Fill Credentials
                </button>
            </div>
            
            <Card className="w-full p-8 shadow-2xl border-[rgba(139,92,246,0.35)] bg-[rgba(15,10,30,0.75)] backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 text-white">Welcome Back</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#e9d5ff] mb-1.5">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] text-white focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] focus:outline-none transition-all"
                            placeholder="your_username"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#e9d5ff] mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] text-white focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] focus:outline-none transition-all"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <Button type="submit" className="w-full py-3 mt-4 shadow-lg shadow-[#8b5cf6]/20" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>
                <div className="mt-6 pt-6 border-t border-[rgba(139,92,246,0.35)]">
                    <Button 
                        onClick={handlePopulateTestData}
                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-600/20 transition-all duration-200"
                        disabled={isPopulatingData || isLoading}
                    >
                        {isPopulatingData ? 'Populating Data...' : '🎲 Populate Test Data (12 Months)'}
                    </Button>
                    <p className="mt-2 text-xs text-[#e9d5ff] text-center">
                        Creates sample expenses, goals, habits, and journal entries for testing
                    </p>
                </div>
                <div className="mt-8 text-center text-sm text-[#e9d5ff]">
                    Don't have an account? <button onClick={onSwitchToSignUp} className="text-[#8b5cf6] hover:text-[#7c3aed] font-bold hover:underline transition-colors">Sign Up</button>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;