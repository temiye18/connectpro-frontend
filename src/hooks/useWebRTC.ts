import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import {
  createPeerConnection,
  addStreamToPeer,
  createOffer,
  createAnswer,
  setRemoteDescription,
  addIceCandidate,
  closePeerConnection,
} from '@/src/lib/webrtc';

export interface PeerConnection {
  socketId: string;
  userId: string;
  userName: string;
  peerConnection: RTCPeerConnection;
  stream?: MediaStream;
}

interface UseWebRTCProps {
  socket: Socket | null;
  meetingId: string;
  localStream: MediaStream | null;
  isConnected: boolean;
}

/**
 * Hook to manage WebRTC peer connections and signaling
 */
export const useWebRTC = ({ socket, meetingId, localStream, isConnected }: UseWebRTCProps) => {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());

  // Keep ref in sync with state
  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

  // Create peer connection for a remote peer
  const createPeer = useCallback(
    (socketId: string, userId: string, userName: string): RTCPeerConnection => {
      const peerConnection = createPeerConnection();

      // Add local stream to peer connection
      if (localStream) {
        addStreamToPeer(peerConnection, localStream);
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('webrtc-ice-candidate', {
            meetingId,
            targetSocketId: socketId,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteStream) {
          setRemoteStreams((prev) => {
            const newStreams = new Map(prev);
            newStreams.set(socketId, remoteStream);
            return newStreams;
          });

          // Update peer with stream
          setPeers((prev) => {
            const newPeers = new Map(prev);
            const peer = newPeers.get(socketId);
            if (peer) {
              peer.stream = remoteStream;
              newPeers.set(socketId, peer);
            }
            return newPeers;
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(`Peer ${socketId} connection state:`, peerConnection.connectionState);

        if (
          peerConnection.connectionState === 'failed' ||
          peerConnection.connectionState === 'disconnected'
        ) {
          // Remove peer after connection fails
          setTimeout(() => {
            removePeer(socketId);
          }, 3000);
        }
      };

      // Handle ICE connection state changes
      peerConnection.oniceconnectionstatechange = () => {
        console.log(`Peer ${socketId} ICE connection state:`, peerConnection.iceConnectionState);
      };

      // Store peer
      const peer: PeerConnection = {
        socketId,
        userId,
        userName,
        peerConnection,
      };

      setPeers((prev) => {
        const newPeers = new Map(prev);
        newPeers.set(socketId, peer);
        return newPeers;
      });

      return peerConnection;
    },
    [socket, meetingId, localStream]
  );

  // Remove peer connection
  const removePeer = useCallback((socketId: string) => {
    setPeers((prev) => {
      const newPeers = new Map(prev);
      const peer = newPeers.get(socketId);
      if (peer) {
        closePeerConnection(peer.peerConnection);
        newPeers.delete(socketId);
      }
      return newPeers;
    });

    setRemoteStreams((prev) => {
      const newStreams = new Map(prev);
      newStreams.delete(socketId);
      return newStreams;
    });
  }, []);

  // Handle peer ready (create offer)
  const handlePeerReady = useCallback(
    async (data: { socketId: string; userId: string; userName: string }) => {
      console.log('Peer ready:', data);

      // Don't create connection if peer already exists
      if (peersRef.current.has(data.socketId)) {
        return;
      }

      const peerConnection = createPeer(data.socketId, data.userId, data.userName);

      try {
        const offer = await createOffer(peerConnection);
        socket?.emit('webrtc-offer', {
          meetingId,
          targetSocketId: data.socketId,
          offer,
        });
      } catch (error) {
        console.error('Error creating offer:', error);
        removePeer(data.socketId);
      }
    },
    [socket, meetingId, createPeer, removePeer]
  );

  // Handle incoming offer
  const handleOffer = useCallback(
    async (data: {
      from: string;
      fromUserId: string;
      fromUserName: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log('Received offer from:', data.from);

      let peerConnection = peersRef.current.get(data.from)?.peerConnection;

      if (!peerConnection) {
        peerConnection = createPeer(data.from, data.fromUserId, data.fromUserName);
      }

      try {
        await setRemoteDescription(peerConnection, data.offer);
        const answer = await createAnswer(peerConnection);

        socket?.emit('webrtc-answer', {
          meetingId,
          targetSocketId: data.from,
          answer,
        });
      } catch (error) {
        console.error('Error handling offer:', error);
        removePeer(data.from);
      }
    },
    [socket, meetingId, createPeer, removePeer]
  );

  // Handle incoming answer
  const handleAnswer = useCallback(
    async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      console.log('Received answer from:', data.from);

      const peer = peersRef.current.get(data.from);
      if (peer) {
        try {
          await setRemoteDescription(peer.peerConnection, data.answer);
        } catch (error) {
          console.error('Error handling answer:', error);
          removePeer(data.from);
        }
      }
    },
    [removePeer]
  );

  // Handle incoming ICE candidate
  const handleIceCandidate = useCallback(
    async (data: { from: string; candidate: RTCIceCandidateInit }) => {
      const peer = peersRef.current.get(data.from);
      if (peer) {
        try {
          await addIceCandidate(peer.peerConnection, data.candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    },
    []
  );

  // Notify that we're ready for WebRTC connections
  const notifyReady = useCallback(() => {
    if (socket && isConnected && localStream) {
      socket.emit('webrtc-ready', { meetingId });
    }
  }, [socket, isConnected, meetingId, localStream]);

  // Set up Socket.IO event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('peer-ready', handlePeerReady);
    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleIceCandidate);

    return () => {
      socket.off('peer-ready', handlePeerReady);
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleIceCandidate);
    };
  }, [socket, handlePeerReady, handleOffer, handleAnswer, handleIceCandidate]);

  // Notify ready when local stream is available
  useEffect(() => {
    if (localStream && isConnected) {
      notifyReady();
    }
  }, [localStream, isConnected, notifyReady]);

  // Cleanup all peer connections on unmount
  useEffect(() => {
    return () => {
      peers.forEach((peer) => {
        closePeerConnection(peer.peerConnection);
      });
    };
  }, []);

  return {
    peers: Array.from(peers.values()),
    remoteStreams,
    removePeer,
  };
};
