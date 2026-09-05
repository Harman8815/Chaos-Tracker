"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { authService, TempDataResponse } from '../../api/authService';
import { Loader2 } from 'lucide-react';

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
                <h1 className="text-5xl font-bold text-accent-primary mb-2 tracking-tight">Chaos Tracker</h1>
                <p className="text-text-secondary text-lg">Your daily companion for growth.</p>
            </div>
            
            {/* Demo Credentials Box */}
            <div className="mb-6 p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
                <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">💡</span>
                    <h3 className="text-sm font-semibold text-accent-primary">Demo Credentials</h3>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-text-secondary font-medium">Username:</span>
                        <code className="bg-white/[0.06] px-2 py-0.5 rounded text-text-primary font-mono">admin</code>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-text-secondary font-medium">Password:</span>
                        <code className="bg-white/[0.06] px-2 py-0.5 rounded text-text-primary font-mono">Admin@123</code>
                    </div>
                </div>
                <Button 
                    onClick={() => {
                        setUsername('admin');
                        setPassword('Admin@123');
                    }}
                    className="mt-3 w-full text-xs"
                    variant="secondary"
                >
                    🚀 Auto-Fill Credentials
                </Button>
            </div>
            
            <Card className="w-full border-white/10 bg-card-bg shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl font-bold text-center text-white">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg text-success text-sm">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="your_username"
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>
                    <div className="mt-6 pt-4 border-t border-border">
                        <Button 
                            onClick={handlePopulateTestData}
                            className="w-full"
                            variant="outline"
                            disabled={isPopulatingData || isLoading}
                        >
                            {isPopulatingData && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPopulatingData ? 'Populating Data...' : '🎲 Populate Test Data (12 Months)'}
                        </Button>
                        <p className="mt-2 text-xs text-text-secondary text-center">
                            Creates sample expenses, goals, habits, and journal entries for testing
                        </p>
                    </div>
                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <button 
                            onClick={onSwitchToSignUp} 
                            className="text-accent-primary hover:text-accent-primary-hover font-bold transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;

