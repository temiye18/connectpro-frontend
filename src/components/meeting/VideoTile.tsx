'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, VideoOff } from 'lucide-react';

interface VideoTileProps {
  stream: MediaStream | null;
  name: string;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isGuest?: boolean;
}

export function VideoTile({ stream, name, isLocal = false, isMuted = false, isVideoOff = false, isGuest = false }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      // Check if stream has active video track
      const checkVideoTrack = () => {
        const videoTracks = stream.getVideoTracks();
        setHasVideo(videoTracks.length > 0 && videoTracks[0].enabled);
      };

      checkVideoTrack();

      // Poll for track changes more frequently
      const checkInterval = setInterval(checkVideoTrack, 300);

      return () => {
        clearInterval(checkInterval);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
    } else {
      setHasVideo(false);
    }
  }, [stream]);

  const showVideo = stream && hasVideo && !isVideoOff;

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
      {/* Always render video element, control visibility */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${showVideo ? 'block' : 'hidden'}`}
      />

      {/* Avatar placeholder when no video */}
      {!showVideo && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="text-white text-6xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Video off indicator - only show when explicitly off */}
      {isVideoOff && (
        <div className="absolute inset-0 flex items-center justify-center">
          <VideoOff className="w-12 h-12 text-white opacity-70" />
        </div>
      )}

      {/* Name label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium truncate">
              {isLocal ? `${name} (You)` : name}
            </span>
            {isGuest && (
              <span className="text-xs text-gray-300 bg-gray-700 px-1.5 py-0.5 rounded">
                Guest
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isMuted && (
              <div className="bg-red-600 rounded-full p-1">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
            {!isMuted && (
              <div className="bg-gray-700 rounded-full p-1">
                <Mic className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Local indicator */}
      {isLocal && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          You
        </div>
      )}
    </div>
  );
}
