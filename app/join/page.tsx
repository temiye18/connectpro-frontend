'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { VideoPreview } from '@/src/components/meeting/VideoPreview';
import { AuthGuard } from '@/src/components/guards/AuthGuard';
import { useJoinMeeting } from '@/src/hooks/mutations/useMeetings';
import { useAuthStore } from '@/src/store/authStore';
import { getErrorMessage } from '@/src/lib/errors';
import Link from 'next/link';

function JoinMeetingForm() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [meetingCode, setMeetingCode] = useState('');
  const [name, setName] = useState(user?.name || '');

  const joinMeetingMutation = useJoinMeeting();

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setMeetingCode(codeFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user?.name && !name) {
      setName(user.name);
    }
  }, [user, name]);

  const handleJoinMeeting = (e: FormEvent) => {
    e.preventDefault();

    if (!meetingCode.trim()) {
      toast.error('Please enter a meeting code');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      toast.error('Name must be between 2 and 50 characters');
      return;
    }

    joinMeetingMutation.mutate(
      {
        meetingCode: meetingCode.trim(),
        name: name.trim(),
        settings: {
          camera: true,
          microphone: true,
        },
      },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error, 'Failed to join meeting'));
        },
        onSuccess: () => {
          toast.success('Joining meeting...');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center px-4 py-12 relative">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="fixed top-8 left-8 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors z-10"
      >
        <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
      </Link>

      <div className="w-full max-w-xl">
        <h1 className="text-5xl font-bold text-white text-center mb-10">Join a meeting</h1>

        <form onSubmit={handleJoinMeeting} className="space-y-5">
          {/* Meeting Code Input */}
          <Input
            type="text"
            placeholder="Enter meeting code or ID"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            required
            disabled={joinMeetingMutation.isPending}
            className="text-base"
          />

          {/* Name Input */}
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={joinMeetingMutation.isPending}
            className="text-base"
          />

          {/* Video Preview */}
          <VideoPreview />

          {/* Join Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={joinMeetingMutation.isPending || !meetingCode.trim() || !name.trim()}
          >
            {joinMeetingMutation.isPending ? <LoadingSpinner size="sm" /> : 'Join Meeting'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function JoinMeetingPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
        <JoinMeetingForm />
      </Suspense>
    </AuthGuard>
  );
}
