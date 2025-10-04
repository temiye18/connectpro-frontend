'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Video, LogIn } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { NewMeetingModal } from '@/src/components/meeting/NewMeetingModal';

export default function DashboardPage() {
  const router = useRouter();
  const [meetingCode, setMeetingCode] = useState('');
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);

  const handleJoinMeeting = (e: FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      router.push(`/join?code=${encodeURIComponent(meetingCode.trim())}`);
    }
  };

  const handleStartMeeting = () => {
    setIsNewMeetingModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">Ready to meet?</h1>
      </div>

      {/* Main Actions */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {/* New Meeting */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Video className="w-10 h-10 text-blue-500" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">New Meeting</h2>
          <p className="text-gray-400 mb-6">Start an instant meeting with one click.</p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartMeeting}
            className="w-full max-w-md"
          >
            Start instant meeting
          </Button>
        </div>

        {/* Join Meeting */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <LogIn className="w-10 h-10 text-blue-500" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Join Meeting</h2>
          <p className="text-gray-400 mb-6">Enter a code to join an existing meeting.</p>
          <form onSubmit={handleJoinMeeting} className="w-full max-w-md flex gap-3">
            <Input
              type="text"
              placeholder="Enter meeting code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!meetingCode}
              className="px-8"
            >
              Join
            </Button>
          </form>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-8">Your recent meetings</h3>
        <div className="space-y-4">
          {/* Meeting Item 1 */}
          <div className="bg-[#252b3b] rounded-lg p-6 flex items-center justify-between hover:bg-[#2a3142] transition-colors">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Project Kickoff</h4>
              <p className="text-gray-400 text-sm">2024-01-20</p>
            </div>
            <Button variant="outline" size="md">
              Start
            </Button>
          </div>

          {/* Meeting Item 2 */}
          <div className="bg-[#252b3b] rounded-lg p-6 flex items-center justify-between hover:bg-[#2a3142] transition-colors">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Team Sync</h4>
              <p className="text-gray-400 text-sm">2024-01-15</p>
            </div>
            <Button variant="outline" size="md">
              Start
            </Button>
          </div>
        </div>
      </div>

      {/* New Meeting Modal */}
      <NewMeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
      />
    </div>
  );
}
