"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { ParticipantsSidebar } from "@/src/components/meeting/ParticipantsSidebar";
import { VideoGrid } from "@/src/components/meeting/VideoGrid";
import { ChatSidebar } from "@/src/components/meeting/ChatSidebar";
import { MeetingControls } from "@/src/components/meeting/MeetingControls";
import { AuthGuard } from "@/src/components/guards/AuthGuard";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { useMeetingDetails } from "@/src/hooks/queries/useMeetings";
import { useMeetingSocket, ChatMessage } from "@/src/hooks/useMeetingSocket";
import { useSocket } from "@/src/hooks/useSocket";
import { useMediaStream } from "@/src/hooks/useMediaStream";
import { useWebRTC } from "@/src/hooks/useWebRTC";
import { useAuthStore } from "@/src/store/authStore";
import { getErrorMessage } from "@/src/lib/errors";

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;
  const { user } = useAuthStore();

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [codeCopied, setCodeCopied] = useState(false);

  // Fetch meeting details
  const {
    data: meetingData,
    isLoading: isLoadingMeeting,
    error: meetingError,
  } = useMeetingDetails(meetingId);

  // Socket connection
  const { socket, isConnected } = useSocket();

  // Local media stream (camera + microphone)
  const {
    localStream,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    stopStream,
  } = useMediaStream({ video: true, audio: true });

  // Socket.IO integration for real-time features
  const {
    participants,
    hasJoinedMeeting,
    leaveMeeting,
    sendMessage,
    updateStatus,
  } = useMeetingSocket({
    meetingId,
    onParticipantJoined: (participant) => {
      toast.success(`${participant.name} joined the meeting`);
    },
    onParticipantLeft: (data) => {
      toast.info(`${data.name} left the meeting`);
    },
    onNewMessage: (message) => {
      setChatMessages((prev) => [...prev, message]);
    },
    onMeetingEnded: (data) => {
      toast.error(`Meeting ended by ${data.endedByName}`);
      stopStream();
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Meeting error occurred"));
    },
  });

  // WebRTC peer connections
  const { peers, remoteStreams } = useWebRTC({
    socket,
    meetingId,
    localStream,
    isConnected: isConnected && hasJoinedMeeting,
  });

  // Handle mic toggle
  const handleToggleMute = () => {
    const newAudioState = !isAudioEnabled;
    toggleAudio();
    updateStatus({ microphone: newAudioState });
  };

  // Handle video toggle
  const handleToggleVideo = async () => {
    const newVideoState = !isVideoEnabled;
    await toggleVideo();
    updateStatus({ camera: newVideoState });
  };

  // Handle leave meeting
  const handleLeaveMeeting = () => {
    leaveMeeting();
    stopStream();
    router.push("/dashboard");
  };

  // Handle send chat message
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Handle copy meeting code
  const handleCopyCode = async () => {
    const meetingCode = meeting?.meetingCode || meeting?.code;
    if (!meetingCode) return;

    try {
      await navigator.clipboard.writeText(meetingCode);
      setCodeCopied(true);
      toast.success("Meeting code copied!");
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error: unknown) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy meeting code");
    }
  };

  // Handle meeting errors
  useEffect(() => {
    if (meetingError) {
      toast.error(getErrorMessage(meetingError, "Failed to load meeting"));
      router.push("/dashboard");
    }
  }, [meetingError, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  // Show loading screen while initializing
  if (isLoadingMeeting || !hasJoinedMeeting) {
    return (
      <AuthGuard>
        <div className="h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-white mt-4">
              {isLoadingMeeting
                ? "Loading meeting..."
                : "Joining meeting..."}
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const meeting = meetingData?.meeting || meetingData?.data?.meeting;
  const isHost = meeting?.host?._id === user?.id;

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col bg-black">
        {/* Top Bar */}
        <div className="h-12 bg-[#0f1419] border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-sm font-medium">
              {meeting?.title || "Meeting Room"}
            </h1>
            {(meeting?.meetingCode || meeting?.code) && (
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors group"
                title="Click to copy meeting code"
              >
                <span className="text-gray-300 text-xs font-mono">
                  {meeting.meetingCode || meeting.code}
                </span>
                {codeCopied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-300" />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm ${
                  isConnected ? "text-green-500" : "text-red-500"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <span className="text-gray-400 text-xs ml-2">
              {participants.length + 1} participant
              {participants.length !== 0 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Participants Sidebar */}
          {isParticipantsOpen && (
            <ParticipantsSidebar
              participants={participants}
              meetingCode={meeting?.meetingCode || meeting?.code || ""}
            />
          )}

          {/* Video Grid */}
          <VideoGrid
            localStream={localStream}
            localUserName={user?.name || "You"}
            localIsMuted={!isAudioEnabled}
            localIsVideoOff={!isVideoEnabled}
            peers={peers}
            participants={participants}
            remoteStreams={remoteStreams}
          />

          {/* Chat Sidebar */}
          {isChatOpen && (
            <ChatSidebar
              messages={chatMessages}
              onClose={() => setIsChatOpen(false)}
              onSendMessage={handleSendMessage}
              currentUserId={user?.id || ""}
            />
          )}
        </div>

        {/* Controls */}
        <MeetingControls
          isMuted={!isAudioEnabled}
          isVideoOff={!isVideoEnabled}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleParticipants={() =>
            setIsParticipantsOpen(!isParticipantsOpen)
          }
          onLeaveMeeting={handleLeaveMeeting}
          isHost={isHost}
          meetingId={meetingId}
        />
      </div>
    </AuthGuard>
  );
}
