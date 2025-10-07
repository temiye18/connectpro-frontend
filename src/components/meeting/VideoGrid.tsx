'use client';

import { VideoTile } from './VideoTile';
import type { PeerConnection } from '@/src/hooks/useWebRTC';
import type { Participant } from '@/src/hooks/useMeetingSocket';

interface VideoGridProps {
  localStream: MediaStream | null;
  localUserName: string;
  localIsMuted: boolean;
  localIsVideoOff: boolean;
  peers: PeerConnection[];
  participants: Participant[];
  remoteStreams: Map<string, MediaStream>;
}

export function VideoGrid({
  localStream,
  localUserName,
  localIsMuted,
  localIsVideoOff,
  peers,
  participants,
  remoteStreams,
}: VideoGridProps) {
  // Calculate grid layout based on participant count
  const totalParticipants = 1 + peers.length; // Local + remote peers

  const getGridClass = () => {
    if (totalParticipants === 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className="flex-1 bg-black p-4 overflow-y-auto">
      <div className={`grid ${getGridClass()} gap-4 h-full`}>
        {/* Local video */}
        <VideoTile
          stream={localStream}
          name={localUserName}
          isLocal={true}
          isMuted={localIsMuted}
          isVideoOff={localIsVideoOff}
        />

        {/* Remote videos */}
        {peers.map((peer) => {
          const stream = remoteStreams.get(peer.socketId);
          const participant = participants.find((p) => p.socketId === peer.socketId);

          return (
            <VideoTile
              key={peer.socketId}
              stream={stream || null}
              name={peer.userName}
              isMuted={participant?.microphone === false}
              isVideoOff={participant?.camera === false}
              isGuest={participant?.isGuest || false}
            />
          );
        })}
      </div>

      {/* No participants message */}
      {totalParticipants === 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <p className="text-lg">Waiting for others to join...</p>
            <p className="text-sm mt-2">Share the meeting code to invite participants</p>
          </div>
        </div>
      )}
    </div>
  );
}
