'use client';

import { useState, FormEvent } from 'react';
import { GuestNavbar } from '@/src/components/layout/GuestNavbar';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Toggle } from '@/src/components/ui/Toggle';
import Link from 'next/link';

export default function GuestJoinPage() {
  const [name, setName] = useState('');
  const [meetingCode, setMeetingCode] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

  const handleCreateMeeting = () => {
    // TODO: Implement create new meeting as guest
    console.log('Create new meeting as guest:', { name, camera: cameraEnabled, microphone: microphoneEnabled });
  };

  const handleContinueAsGuest = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement join meeting as guest
    console.log('Continue as guest:', { name, meetingCode, camera: cameraEnabled, microphone: microphoneEnabled });
  };

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
              className="text-base"
            />

            {/* Meeting Code Input */}
            <Input
              type="text"
              placeholder="Enter meeting code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="text-base"
            />

            {/* OR Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Create New Meeting Button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleCreateMeeting}
            >
              Create New Meeting
            </Button>

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
              disabled={!name}
              className="mt-6"
            >
              Continue as Guest
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
