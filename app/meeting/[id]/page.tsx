'use client';

import { useState } from 'react';
import { ParticipantsSidebar } from '@/src/components/meeting/ParticipantsSidebar';
import { VideoGrid } from '@/src/components/meeting/VideoGrid';
import { ChatSidebar } from '@/src/components/meeting/ChatSidebar';
import { MeetingControls } from '@/src/components/meeting/MeetingControls';

export default function MeetingRoomPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Top Bar */}
      <div className="h-12 bg-[#0f1419] border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-sm font-medium">Meeting ID: xyz-abc-123</h1>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 text-sm font-medium">Recording</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-500 text-sm">Good</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Participants Sidebar */}
        <ParticipantsSidebar />

        {/* Video Grid */}
        <VideoGrid />

        {/* Chat Sidebar */}
        {isChatOpen && <ChatSidebar onClose={() => setIsChatOpen(false)} />}
      </div>

      {/* Controls */}
      <MeetingControls onToggleChat={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
}
