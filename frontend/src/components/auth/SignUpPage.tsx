import React, { useState, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { DataContext } from '../../context/DataContext';
import { authService } from '../../api/authService';

interface SignUpPageProps {
    onSignUp: () => void;
    onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUserProfile } = useContext(DataContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.signup({ username, email, password });

            if (response.success && response.user) {
                // Store user data in local storage
                localStorage.setItem('user', JSON.stringify(response.user));

                // Update context with new user profile
                setUserProfile(prev => ({
                    ...prev,
                    name: response.user?.username || username,
                    email: response.user?.email || email,
                    joinDate: new Date().toISOString()
                }));

                onSignUp();
            } else {
                // Handle validation errors
                if (typeof response.error === 'object') {
                    const errors = Object.values(response.error).flat();
                    setError(errors.join(', '));
                } else {
                    setError(response.error || 'Signup failed');
                }
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
                <h1 className="text-5xl font-bold text-[#8b5cf6] mb-2 tracking-tight">Tracker</h1>
                <p className="text-[#e9d5ff] text-lg">Start your journey today.</p>
            </div>
            <Card className="w-full p-8 shadow-2xl border-[rgba(139,92,246,0.35)] bg-[rgba(15,10,30,0.75)] backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 text-white">Create Account</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                        {error}
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
                            placeholder="johndoe"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#e9d5ff] mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] text-white focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] focus:outline-none transition-all"
                            placeholder="name@example.com"
                            required
                            autoComplete="email"
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
                            minLength={8}
                            autoComplete="new-password"
                        />
                        <p className="text-xs text-[#e9d5ff] mt-1">Must be at least 8 characters</p>
                    </div>
                    <Button type="submit" className="w-full py-3 mt-4 shadow-lg shadow-[#8b5cf6]/20" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <div className="mt-8 text-center text-sm text-[#e9d5ff]">
                    Already have an account? <button onClick={onSwitchToLogin} className="text-[#8b5cf6] hover:text-[#7c3aed] font-bold hover:underline transition-colors">Log In</button>
                </div>
            </Card>
        </div>
    );
};

export default SignUpPage;