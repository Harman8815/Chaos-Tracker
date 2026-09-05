"use client";

import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { DataContext } from '../../context/DataContext';
import { authService } from '../../api/authService';
import { Loader2 } from 'lucide-react';

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
                localStorage.setItem('user', JSON.stringify(response.user));

                setUserProfile(prev => ({
                    ...prev,
                    name: response.user?.username || username,
                    email: response.user?.email || email,
                    joinDate: new Date().toISOString()
                }));

                onSignUp();
            } else {
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
                <h1 className="text-5xl font-bold text-accent-primary mb-2 tracking-tight">Chaos Tracker</h1>
                <p className="text-text-secondary text-lg">Start your journey today.</p>
            </div>
            <Card className="w-full border-white/10 bg-card-bg shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="signup-username">Username</Label>
                            <Input
                                id="signup-username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="johndoe"
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <Input
                                id="signup-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <Input
                                id="signup-password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <p className="text-xs text-text-secondary">Must be at least 8 characters</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <button 
                            onClick={onSwitchToLogin} 
                            className="text-accent-primary hover:text-accent-primary-hover font-bold transition-colors"
                        >
                            Log In
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpPage;
