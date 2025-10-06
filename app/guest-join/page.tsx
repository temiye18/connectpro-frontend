'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { GuestNavbar } from '@/src/components/layout/GuestNavbar';
import { GuestGuard } from '@/src/components/guards/GuestGuard';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Toggle } from '@/src/components/ui/Toggle';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useGuestSession } from '@/src/hooks/mutations/useAuth';
import { useJoinMeeting } from '@/src/hooks/mutations/useMeetings';
import { getErrorMessage } from '@/src/lib/errors';
import Link from 'next/link';

function GuestJoinForm() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') || '';

  const [name, setName] = useState('');
  const [meetingCode, setMeetingCode] = useState(codeFromUrl);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

  const guestSessionMutation = useGuestSession();
  const joinMeetingMutation = useJoinMeeting();

  const handleContinueAsGuest = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      toast.error('Name must be between 2 and 50 characters');
      return;
    }

    if (!meetingCode.trim()) {
      toast.error('Please enter a meeting code');
      return;
    }

    // First create guest session
    guestSessionMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          // Then join meeting
          joinMeetingMutation.mutate(
            {
              meetingCode: meetingCode.trim(),
              name: name.trim(),
              settings: {
                camera: cameraEnabled,
                microphone: microphoneEnabled,
              },
            },
            {
              onError: (error) => {
                toast.error(getErrorMessage(error, 'Failed to join meeting'));
              },
            }
          );
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, 'Failed to create guest session'));
        },
      }
    );
  };

  const isLoading = guestSessionMutation.isPending || joinMeetingMutation.isPending;

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <GuestNavbar />

        <div className="pt-20 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-3">Join as Guest</h1>
            <p className="text-gray-400">Enter your details to join the meeting.</p>
          </div>

          <form onSubmit={handleContinueAsGuest} className="space-y-5">
            {/* Name Input */}
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="text-base"
            />

            {/* Meeting Code Input */}
            <Input
              type="text"
              placeholder="Enter meeting code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              required
              disabled={isLoading}
              className="text-base"
            />

            {/* Quick Settings */}
            <div className="pt-4 space-y-4">
              {/* Camera Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white text-base">Camera</span>
                <Toggle enabled={cameraEnabled} onChange={setCameraEnabled} />
              </div>

              {/* Microphone Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white text-base">Microphone</span>
                <Toggle enabled={microphoneEnabled} onChange={setMicrophoneEnabled} />
              </div>
            </div>

            {/* Continue as Guest Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || !name.trim() || !meetingCode.trim()}
              className="mt-6"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Continue as Guest'}
            </Button>

            {/* Sign in Instead Link */}
            <div className="text-center pt-2">
              <Link
                href="/signin"
                className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function GuestJoinPage() {
  return (
    <GuestGuard>
      <Suspense fallback={<div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
        <GuestJoinForm />
      </Suspense>
    </GuestGuard>
  );
}
