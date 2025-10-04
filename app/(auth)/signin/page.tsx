'use client';

import { useState, FormEvent } from 'react';
import { Video, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implement sign in with TanStack Query mutation
      console.log('Sign in:', { email, password });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to dashboard (will be implemented with useSignIn mutation)
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-8 left-8 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors z-10"
      >
        <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
      </Link>

      <div className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
        {/* Logo */}
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
          <Video className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold text-white mb-2">ConnectPro</h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-base">Sign in to continue</p>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={isLoading}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={isLoading}
          minLength={8}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      </div>
    </>
  );
}
