'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { VideoPreview } from '@/src/components/meeting/VideoPreview';
import Link from 'next/link';

export default function JoinMeetingPage() {
  const searchParams = useSearchParams();
  const [meetingCode, setMeetingCode] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setMeetingCode(codeFromUrl);
    }
  }, [searchParams]);

  const handleJoinMeeting = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement join meeting logic with TanStack Query mutation
    console.log('Joining meeting:', { meetingCode, name });
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
            className="text-base"
          />

          {/* Name Input */}
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
            disabled={!meetingCode || !name}
          >
            Join Meeting
          </Button>
        </form>
      </div>
    </div>
  );
}
