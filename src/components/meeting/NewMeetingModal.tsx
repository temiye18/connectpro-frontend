'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Mic, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/src/components/ui/Modal';
import { Toggle } from '@/src/components/ui/Toggle';
import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { getErrorMessage } from '@/src/lib/errors';
import { meetingService } from '@/src/services/meeting.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/constants/queryKeys';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewMeetingModal({ isOpen, onClose }: NewMeetingModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState('');

  // Create meeting mutation (without auto-redirect)
  const createMeetingMutation = useMutation({
    mutationFn: () =>
      meetingService.createMeeting({
        title: 'Instant Meeting',
        settings: {
          chat: true,
          screenSharing: true,
        },
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.recent() });
      // Backend returns flat response: { meetingId, meetingLink, meetingCode }
      setMeetingId(response.meetingId || '');
      setMeetingLink(response.meetingLink || '');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create meeting'));
      onClose();
    },
  });

  // Create meeting when modal opens
  useEffect(() => {
    if (isOpen && !meetingId) {
      createMeetingMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMeetingId(null);
      setMeetingLink('');
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    if (!meetingLink) return;

    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      toast.success('Meeting link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error: unknown) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleStartMeeting = () => {
    if (!meetingId) return;

    // Navigate to meeting room
    router.push(`/meeting/${meetingId}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Start your meeting</h2>

        {/* Meeting Link */}
        {createMeetingMutation.isPending ? (
          <div className="bg-[#374151] rounded-lg p-4 mb-8 flex items-center justify-center">
            <LoadingSpinner size="sm" />
            <span className="ml-3 text-gray-300 text-sm">Creating meeting...</span>
          </div>
        ) : (
          <div className="bg-[#374151] rounded-lg p-4 mb-8 flex items-center justify-between">
            <span className="text-gray-300 text-sm flex-1 truncate">{meetingLink || 'Generating link...'}</span>
            <button
              onClick={handleCopyLink}
              disabled={!meetingLink}
              className="ml-3 text-blue-500 hover:text-blue-400 font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}

        {/* Quick Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-left">Quick settings</h3>
          <div className="space-y-4">
            {/* Camera Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-gray-400" />
                <span className="text-white">Camera</span>
              </div>
              <Toggle enabled={cameraEnabled} onChange={setCameraEnabled} />
            </div>

            {/* Microphone Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-gray-400" />
                <span className="text-white">Microphone</span>
              </div>
              <Toggle enabled={microphoneEnabled} onChange={setMicrophoneEnabled} />
            </div>
          </div>
        </div>

        {/* Start Meeting Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleStartMeeting}
          disabled={!meetingId || createMeetingMutation.isPending}
          className="mb-4"
        >
          Start Meeting
        </Button>

        {/* Share via Email */}
        <button className="text-gray-400 hover:text-white text-sm underline transition-colors">
          Share via email
        </button>
      </div>
    </Modal>
  );
}
