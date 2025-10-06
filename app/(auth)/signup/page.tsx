'use client';

import { useState, FormEvent } from 'react';
import { Video, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Input } from '@/src/components/ui/Input';
import { PasswordInput } from '@/src/components/ui/PasswordInput';
import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { PasswordStrength } from '@/src/components/ui/PasswordStrength';
import { useRegister } from '@/src/hooks/mutations/useAuth';
import { GuestGuard } from '@/src/components/guards/GuestGuard';
import { getErrorMessage } from '@/src/lib/errors';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const registerMutation = useRegister();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate name
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (name.trim().length > 50) {
      toast.error('Name must not exceed 50 characters');
      return;
    }

    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      toast.error('Name can only contain letters, spaces, hyphens, and apostrophes');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error('Password must contain uppercase, lowercase, and number');
      return;
    }

    registerMutation.mutate(
      { name, email, password },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
        },
        onSuccess: () => {
          toast.success('Account created successfully! Redirecting...');
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
          <p className="text-gray-400 text-base">Create your account</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            disabled={registerMutation.isPending}
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={registerMutation.isPending}
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={registerMutation.isPending}
          />

          {/* Password Strength Indicator */}
          {password && <PasswordStrength password={password} />}

          <PasswordInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            disabled={registerMutation.isPending}
            error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center pt-2">
            <span className="text-gray-400 text-sm">Already have an account? </span>
            <Link
              href="/signin"
              className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
        </div>
      </>
    </GuestGuard>
  );
}
