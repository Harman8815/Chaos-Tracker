import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface LoginPageProps {
    onLogin: () => void;
    onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 800);
    };

    return (
        <div className="w-full max-w-md px-4 animate-fade-in relative z-10">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-accent-primary mb-2 tracking-tight">Tracker</h1>
                <p className="text-text-secondary text-lg">Your daily companion for growth.</p>
            </div>
            <Card className="w-full p-8 shadow-2xl border-border/50 bg-card-bg/80 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all"
                            placeholder="name@example.com"
                            required
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