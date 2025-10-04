'use client';

import { Mic, MicOff } from 'lucide-react';
import Image from 'next/image';

interface VideoParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

const mockVideoParticipants: VideoParticipant[] = [
  { id: '1', name: 'Liam', avatar: '/avatar-1.png', isMuted: false, isVideoOff: false },
  { id: '2', name: 'Sophia', avatar: '/avatar-2.png', isMuted: false, isVideoOff: false },
  { id: '3', name: 'Noah', avatar: '/avatar-4.png', isMuted: false, isVideoOff: false },
  { id: '4', name: 'Olivia', avatar: '/avatar-3.png', isMuted: false, isVideoOff: false },
];

export function VideoGrid() {
  const participantCount = mockVideoParticipants.length;

  // Determine grid layout based on participant count
  const getGridCols = () => {
    if (participantCount <= 1) return 'grid-cols-1';
    if (participantCount <= 4) return 'grid-cols-2';
    if (participantCount <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className={`flex-1 grid ${getGridCols()} gap-0.5 p-0.5 bg-black`}>
      {mockVideoParticipants.map((participant) => (
        <div key={participant.id} className="relative bg-gray-900 rounded-lg overflow-hidden">
          {participant.isVideoOff ? (
            // Video Off - Show Avatar
            <div className="absolute inset-0 flex items-center justify-center bg-[#2a3441]">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-600 mx-auto mb-2 flex items-center justify-center text-4xl font-bold text-white">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          ) : (
            // Video On - Show Avatar as placeholder
            <div className="absolute inset-0">
              <Image
                src={participant.avatar}
                alt={participant.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Name Label */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md flex items-center gap-2">
            <span className="text-white text-sm font-medium">{participant.name}</span>
            {participant.isMuted && (
              <MicOff className="w-4 h-4 text-red-500" />
            )}
          </div>

          {/* Muted Icon (Top Right) */}
          {participant.isMuted && (
            <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <MicOff className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
