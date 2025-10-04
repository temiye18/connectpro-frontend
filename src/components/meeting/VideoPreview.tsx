'use client';

import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

export function VideoPreview() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl overflow-hidden">
      {/* Video Preview - Placeholder for now */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* TODO: Replace with actual video stream */}
        <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300" />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {/* Microphone Toggle */}
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${isMicOn ? 'bg-gray-800/80 text-white hover:bg-gray-700/80' : 'bg-red-600 text-white hover:bg-red-700'}
          `}
        >
          {isMicOn ? (
            <Mic className="w-5 h-5" strokeWidth={2} />
          ) : (
            <MicOff className="w-5 h-5" strokeWidth={2} />
          )}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${isCameraOn ? 'bg-gray-800/80 text-white hover:bg-gray-700/80' : 'bg-red-600 text-white hover:bg-red-700'}
          `}
        >
          {isCameraOn ? (
            <Video className="w-5 h-5" strokeWidth={2} />
          ) : (
            <VideoOff className="w-5 h-5" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
