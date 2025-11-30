import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { authService } from '../../api/authService';

interface LoginPageProps {
    onLogin: () => void;
    onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignUp }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

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

    return (
        <div className="w-full max-w-md px-4 animate-fade-in relative z-10">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-accent-primary mb-2 tracking-tight">Tracker</h1>
                <p className="text-text-secondary text-lg">Your daily companion for growth.</p>
            </div>
            <Card className="w-full p-8 shadow-2xl border-border/50 bg-card-bg/80 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Welcome Back</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all"
                            placeholder="your_username"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <Button type="submit" className="w-full py-3 mt-4 shadow-lg shadow-accent-primary/20" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>
                <div className="mt-8 text-center text-sm text-text-secondary">
                    Don't have an account? <button onClick={onSwitchToSignUp} className="text-accent-primary hover:text-accent-primary-dark font-bold hover:underline transition-colors">Sign Up</button>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;