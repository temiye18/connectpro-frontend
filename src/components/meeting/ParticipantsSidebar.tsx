'use client';

import { UserPlus, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/src/components/ui/Button';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

const mockParticipants: Participant[] = [
  { id: '1', name: 'Liam', avatar: '/avatar-1.png', isMuted: false, isVideoOff: false },
  { id: '2', name: 'Sophia', avatar: '/avatar-2.png', isMuted: true, isVideoOff: false },
  { id: '3', name: 'Noah', avatar: '/avatar-3.png', isMuted: false, isVideoOff: false },
  { id: '4', name: 'Olivia', avatar: '/avatar-4.png', isMuted: false, isVideoOff: false },
];

export function ParticipantsSidebar() {
  return (
    <div className="w-64 bg-[#0f1419] h-full flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-white font-semibold mb-1">Participants ({mockParticipants.length})</h3>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {mockParticipants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-3 hover:bg-gray-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <Image
                src={participant.avatar}
                alt={participant.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-sm flex-1 truncate">{participant.name}</span>
            <div className="flex items-center gap-1">
              {participant.isMuted && (
                <MicOff className="w-4 h-4 text-red-500" />
              )}
              {participant.isVideoOff && (
                <VideoOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Button */}
      <div className="p-4 border-t border-gray-800">
        <Button variant="primary" size="md" fullWidth className="flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite people
        </Button>
      </div>
    </div>
  );
}
