'use client';

import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Share2, Users, MessageSquare, Smile, PhoneOff } from 'lucide-react';

interface MeetingControlsProps {
  onToggleChat: () => void;
}

export function MeetingControls({ onToggleChat }: MeetingControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleEndCall = () => {
    // TODO: Implement end call logic
    console.log('End call');
  };

  return (
    <div className="h-20 bg-[#0f1419] border-t border-gray-800 flex items-center justify-center gap-3 px-4">
      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        {isMuted ? (
          <MicOff className="w-5 h-5 text-white" strokeWidth={2} />
        ) : (
          <Mic className="w-5 h-5 text-white" strokeWidth={2} />
        )}
      </button>

      {/* Stop Video Button */}
      <button
        onClick={() => setIsVideoOff(!isVideoOff)}
        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        {isVideoOff ? (
          <VideoOff className="w-5 h-5 text-white" strokeWidth={2} />
        ) : (
          <Video className="w-5 h-5 text-white" strokeWidth={2} />
        )}
      </button>

      {/* Share Screen Button */}
      <button className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
        <Share2 className="w-5 h-5 text-white" strokeWidth={2} />
      </button>

      {/* Participants Button */}
      <button className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
        <Users className="w-5 h-5 text-white" strokeWidth={2} />
      </button>

      {/* Chat Button */}
      <button
        onClick={onToggleChat}
        className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
      >
        <MessageSquare className="w-5 h-5 text-white" strokeWidth={2} />
      </button>

      {/* Reactions Button */}
      <button className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
        <Smile className="w-5 h-5 text-white" strokeWidth={2} />
      </button>

      {/* End Call Button */}
      <button
        onClick={handleEndCall}
        className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors ml-2"
      >
        <PhoneOff className="w-5 h-5 text-white" strokeWidth={2} />
      </button>
    </div>
  );
}
