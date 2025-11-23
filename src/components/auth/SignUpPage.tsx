import React, { useState, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { DataContext } from '../../context/DataContext';

interface SignUpPageProps {
    onSignUp: () => void;
    onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUserProfile } = useContext(DataContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(() => {
            setUserProfile(prev => ({
                ...prev,
                name: name,
                email: email,
                joinDate: new Date().toISOString()
            }));
            setIsLoading(false);
            onSignUp();
        }, 800);
    };

    return (
        <div className="w-full max-w-md px-4 animate-fade-in relative z-10">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-accent-primary mb-2 tracking-tight">Tracker</h1>
                <p className="text-text-secondary text-lg">Start your journey today.</p>
            </div>
            <Card className="w-full p-8 shadow-2xl border-border/50 bg-card-bg/80 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-input-bg border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <div className="mt-8 text-center text-sm text-text-secondary">
                    Already have an account? <button onClick={onSwitchToLogin} className="text-accent-primary hover:text-accent-primary-dark font-bold hover:underline transition-colors">Log In</button>
                </div>
            </Card>
        </div>
    );
};

export default SignUpPage;