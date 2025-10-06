'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Video, LogIn, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { NewMeetingModal } from '@/src/components/meeting/NewMeetingModal';
import { AuthGuard } from '@/src/components/guards/AuthGuard';
import { useRecentMeetings } from '@/src/hooks/queries/useMeetings';
import { useStartMeeting } from '@/src/hooks/mutations/useMeetings';
import { getErrorMessage } from '@/src/lib/errors';

export default function DashboardPage() {
  const router = useRouter();
  const [meetingCode, setMeetingCode] = useState('');
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);

  const { data: recentMeetingsData, isLoading: isLoadingMeetings } = useRecentMeetings(10);
  const startMeetingMutation = useStartMeeting();

  const handleJoinMeeting = (e: FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      router.push(`/join?code=${encodeURIComponent(meetingCode.trim())}`);
    }
  };

  const handleStartMeeting = () => {
    setIsNewMeetingModalOpen(true);
  };

  const handleStartExistingMeeting = (meetingId: string) => {
    startMeetingMutation.mutate(meetingId, {
      onError: (error) => {
        toast.error(getErrorMessage(error, 'Failed to start meeting'));
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AuthGuard>
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

        {isLoadingMeetings ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : recentMeetingsData?.data?.meetings && recentMeetingsData.data.meetings.length > 0 ? (
          <div className="space-y-4">
            {recentMeetingsData.data.meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="bg-[#252b3b] rounded-lg p-6 flex items-center justify-between hover:bg-[#2a3142] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{meeting.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatDate(meeting.createdAt)}</span>
                      <span className="capitalize">{meeting.status}</span>
                      {meeting.participants.length > 0 && (
                        <span>{meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handleStartExistingMeeting(meeting._id)}
                  disabled={startMeetingMutation.isPending || meeting.status === 'ended'}
                >
                  {meeting.status === 'ended' ? 'Ended' : 'Start'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No recent meetings. Start your first meeting!</p>
          </div>
        )}
      </div>

      {/* New Meeting Modal */}
      <NewMeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
      />
      </div>
    </AuthGuard>
  );
}
