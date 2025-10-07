'use client';

import { useState } from 'react';
import { UserPlus, MicOff, VideoOff, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/Button';
import type { Participant } from '@/src/hooks/useMeetingSocket';

interface ParticipantsSidebarProps {
  participants: Participant[];
  meetingCode: string;
}

export function ParticipantsSidebar({ participants, meetingCode }: ParticipantsSidebarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!meetingCode) return;

    try {
      await navigator.clipboard.writeText(meetingCode);
      setCopied(true);
      toast.success('Meeting code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error: unknown) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy meeting code');
    }
  };

  return (
    <div className="w-64 bg-[#0f1419] h-full flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-white font-semibold mb-1">Participants ({participants.length})</h3>
        {meetingCode && (
          <button
            onClick={handleCopyCode}
            className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Copied!' : `Code: ${meetingCode}`}
          </button>
        )}
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {participants.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No participants yet
          </div>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.socketId}
              className="flex items-center gap-3 p-3 hover:bg-gray-800/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm truncate">{participant.name}</span>
                  {participant.isGuest && (
                    <span className="text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">
                      Guest
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {participant.microphone === false && (
                  <MicOff className="w-4 h-4 text-red-500" />
                )}
                {participant.camera === false && (
                  <VideoOff className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invite Button */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleCopyCode}
          className="flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite people
        </Button>
      </div>
    </div>
  );
}
