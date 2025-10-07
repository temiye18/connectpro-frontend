import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';

export interface Participant {
  userId: string;
  name: string;
  email?: string;
  isGuest: boolean;
  socketId: string;
  camera?: boolean;
  microphone?: boolean;
}

export interface ChatMessage {
  id: string;
  meetingId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  isGuest: boolean;
}

interface UseMeetingSocketProps {
  meetingId: string;
  onParticipantJoined?: (participant: Participant) => void;
  onParticipantLeft?: (data: { userId: string; name: string; socketId: string }) => void;
  onParticipantStatusUpdated?: (data: { userId: string; status: { camera: boolean; microphone: boolean } }) => void;
  onNewMessage?: (message: ChatMessage) => void;
  onMeetingEnded?: (data: { meetingId: string; endedBy: string; endedByName: string; reason?: string }) => void;
  onError?: (error: { message: string; error?: string }) => void;
}

/**
 * Hook to manage meeting-specific Socket.IO events
 */
export const useMeetingSocket = ({
  meetingId,
  onParticipantJoined,
  onParticipantLeft,
  onParticipantStatusUpdated,
  onNewMessage,
  onMeetingEnded,
  onError,
}: UseMeetingSocketProps) => {
  const { socket, isConnected } = useSocket();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hasJoinedMeeting, setHasJoinedMeeting] = useState(false);

  // Join meeting
  const joinMeeting = useCallback(() => {
    if (!socket || !isConnected || !meetingId) return;

    socket.emit('join-meeting', meetingId);
  }, [socket, isConnected, meetingId]);

  // Leave meeting
  const leaveMeeting = useCallback(() => {
    if (!socket || !meetingId) return;

    socket.emit('leave-meeting', meetingId);
  }, [socket, meetingId]);

  // Send chat message
  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !isConnected || !meetingId) return;

      socket.emit('send-message', {
        meetingId,
        message,
      });
    },
    [socket, isConnected, meetingId]
  );

  // Update participant status (camera/mic)
  const updateStatus = useCallback(
    (status: { camera?: boolean; microphone?: boolean }) => {
      if (!socket || !isConnected || !meetingId) return;

      socket.emit('participant-status-changed', {
        meetingId,
        status,
      });
    },
    [socket, isConnected, meetingId]
  );

  // Start typing indicator
  const startTyping = useCallback(() => {
    if (!socket || !isConnected || !meetingId) return;

    socket.emit('typing-start', { meetingId });
  }, [socket, isConnected, meetingId]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (!socket || !isConnected || !meetingId) return;

    socket.emit('typing-stop', { meetingId });
  }, [socket, isConnected, meetingId]);

  // Set up event listeners
  useEffect(() => {
    if (!socket) return;

    // Joined meeting confirmation
    const handleJoinedMeeting = (data: { meetingId: string; success: boolean }) => {
      if (data.success) {
        setHasJoinedMeeting(true);
      }
    };

    // Current participants list
    const handleCurrentParticipants = (data: { participants: Participant[]; count: number }) => {
      setParticipants(data.participants);
    };

    // Participant joined
    const handleParticipantJoined = (participant: Participant) => {
      setParticipants((prev) => [...prev, participant]);
      onParticipantJoined?.(participant);
    };

    // Participant left
    const handleParticipantLeft = (data: { userId: string; name: string; socketId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.socketId !== data.socketId));
      onParticipantLeft?.(data);
    };

    // Participant disconnected
    const handleParticipantDisconnected = (data: { userId: string; name: string; socketId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.socketId !== data.socketId));
      onParticipantLeft?.(data);
    };

    // Participant status updated
    const handleParticipantStatusUpdated = (data: {
      userId: string;
      name: string;
      socketId: string;
      status: { camera: boolean | null; microphone: boolean | null };
    }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.socketId === data.socketId
            ? {
                ...p,
                camera: data.status.camera ?? p.camera,
                microphone: data.status.microphone ?? p.microphone,
              }
            : p
        )
      );
      onParticipantStatusUpdated?.(data as { userId: string; status: { camera: boolean; microphone: boolean } });
    };

    // New chat message
    const handleNewMessage = (message: ChatMessage) => {
      onNewMessage?.(message);
    };

    // Meeting ended
    const handleMeetingEnded = (data: {
      meetingId: string;
      endedBy: string;
      endedByName: string;
      reason?: string;
    }) => {
      setHasJoinedMeeting(false);
      onMeetingEnded?.(data);
    };

    // Error handlers
    const handleMeetingError = (error: { message: string; error?: string }) => {
      onError?.(error);
    };

    const handleChatError = (error: { message: string; error?: string }) => {
      onError?.(error);
    };

    // Register event listeners
    socket.on('joined-meeting', handleJoinedMeeting);
    socket.on('current-participants', handleCurrentParticipants);
    socket.on('participant-joined', handleParticipantJoined);
    socket.on('participant-left', handleParticipantLeft);
    socket.on('participant-disconnected', handleParticipantDisconnected);
    socket.on('participant-status-updated', handleParticipantStatusUpdated);
    socket.on('new-message', handleNewMessage);
    socket.on('meeting-ended', handleMeetingEnded);
    socket.on('meeting-error', handleMeetingError);
    socket.on('chat-error', handleChatError);

    // Cleanup
    return () => {
      socket.off('joined-meeting', handleJoinedMeeting);
      socket.off('current-participants', handleCurrentParticipants);
      socket.off('participant-joined', handleParticipantJoined);
      socket.off('participant-left', handleParticipantLeft);
      socket.off('participant-disconnected', handleParticipantDisconnected);
      socket.off('participant-status-updated', handleParticipantStatusUpdated);
      socket.off('new-message', handleNewMessage);
      socket.off('meeting-ended', handleMeetingEnded);
      socket.off('meeting-error', handleMeetingError);
      socket.off('chat-error', handleChatError);
    };
  }, [socket, onParticipantJoined, onParticipantLeft, onParticipantStatusUpdated, onNewMessage, onMeetingEnded, onError]);

  // Auto-join meeting when socket connects
  useEffect(() => {
    if (isConnected && !hasJoinedMeeting && meetingId) {
      joinMeeting();
    }
  }, [isConnected, hasJoinedMeeting, meetingId, joinMeeting]);

  return {
    participants,
    hasJoinedMeeting,
    joinMeeting,
    leaveMeeting,
    sendMessage,
    updateStatus,
    startTyping,
    stopTyping,
  };
};
