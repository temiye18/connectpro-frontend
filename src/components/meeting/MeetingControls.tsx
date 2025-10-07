'use client';

import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, PhoneOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLeaveMeeting, useEndMeeting } from '@/src/hooks/mutations/useMeetings';
import { getErrorMessage } from '@/src/lib/errors';

interface MeetingControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onLeaveMeeting: () => void;
  isHost: boolean;
  meetingId: string;
}

export function MeetingControls({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onToggleChat,
  onToggleParticipants,
  onLeaveMeeting,
  isHost,
  meetingId,
}: MeetingControlsProps) {
  const leaveMeetingMutation = useLeaveMeeting();
  const endMeetingMutation = useEndMeeting();

  const handleLeaveMeeting = async () => {
    if (isHost) {
      // Show confirmation for host
      const confirmed = confirm(
        'You are the host. Do you want to:\n\n' +
          'OK - End meeting for everyone\n' +
          'Cancel - Just leave (meeting continues)'
      );

      if (confirmed) {
        // End meeting for everyone
        endMeetingMutation.mutate(meetingId, {
          onSuccess: () => {
            toast.success('Meeting ended');
            onLeaveMeeting();
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, 'Failed to end meeting'));
          },
        });
      } else {
        // Just leave
        leaveMeetingMutation.mutate(meetingId, {
          onSuccess: () => {
            toast.success('Left meeting');
            onLeaveMeeting();
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, 'Failed to leave meeting'));
          },
        });
      }
    } else {
      // Non-host: just leave
      leaveMeetingMutation.mutate(meetingId, {
        onSuccess: () => {
          toast.success('Left meeting');
          onLeaveMeeting();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, 'Failed to leave meeting'));
        },
      });
    }
  };

  return (
    <div className="h-20 bg-[#0f1419] border-t border-gray-800 flex items-center justify-center gap-3 px-4">
      {/* Mute Button */}
      <button
        onClick={onToggleMute}
        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <MicOff className="w-5 h-5 text-white" strokeWidth={2} />
        ) : (
          <Mic className="w-5 h-5 text-white" strokeWidth={2} />
        )}
      </button>

      {/* Stop Video Button */}
      <button
        onClick={onToggleVideo}
        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title={isVideoOff ? 'Start video' : 'Stop video'}
      >
        {isVideoOff ? (
          <VideoOff className="w-5 h-5 text-white" strokeWidth={2} />
        ) : (
          <Video className="w-5 h-5 text-white" strokeWidth={2} />
        )}
      </button>

      {/* Participants Button */}
      <button
        onClick={onToggleParticipants}
        className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
        title="Toggle participants"
      >
        <Users className="w-5 h-5 text-white" strokeWidth={2} />
      </button>

      {/* Chat Button */}
      <button
        onClick={onToggleChat}
        className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
        title="Toggle chat"
      >
        <MessageSquare className="w-5 h-5 text-white" strokeWidth={2} />
      </button>

      {/* Leave/End Meeting Button */}
      <button
        onClick={handleLeaveMeeting}
        disabled={leaveMeetingMutation.isPending || endMeetingMutation.isPending}
        className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors ml-2"
        title={isHost ? 'Leave or end meeting' : 'Leave meeting'}
      >
        <PhoneOff className="w-5 h-5 text-white" strokeWidth={2} />
      </button>
    </div>
  );
}
