'use client';

import { useState, FormEvent } from 'react';
import { Video, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Input } from '@/src/components/ui/Input';
import { PasswordInput } from '@/src/components/ui/PasswordInput';
import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useLogin } from '@/src/hooks/mutations/useAuth';
import { GuestGuard } from '@/src/components/guards/GuestGuard';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password) {
      toast.error('Password is required');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Invalid email or password');
        },
        onSuccess: () => {
          toast.success('Login successful! Redirecting...');
        },
      }
    );
  };

  return (
    <GuestGuard>
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
          autoComplete="email"
          disabled={loginMutation.isPending}
        />

        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loginMutation.isPending}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center pt-2">
          <span className="text-gray-400 text-sm">Don't have an account? </span>
          <Link
            href="/signup"
            className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
        </div>
      </>
    </GuestGuard>
  );
}
