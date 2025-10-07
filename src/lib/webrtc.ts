/**
 * WebRTC Configuration
 */
export const WEBRTC_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
    // Add TURN servers here for production
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'username',
    //   credential: 'password',
    // },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * Create RTCPeerConnection with configuration
 */
export const createPeerConnection = (): RTCPeerConnection => {
  return new RTCPeerConnection(WEBRTC_CONFIG);
};

/**
 * Add local stream tracks to peer connection
 */
export const addStreamToPeer = (
  peerConnection: RTCPeerConnection,
  stream: MediaStream
): void => {
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
};

/**
 * Create and set local description (offer)
 */
export const createOffer = async (
  peerConnection: RTCPeerConnection
): Promise<RTCSessionDescriptionInit> => {
  const offer = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await peerConnection.setLocalDescription(offer);
  return offer;
};

/**
 * Create and set local description (answer)
 */
export const createAnswer = async (
  peerConnection: RTCPeerConnection
): Promise<RTCSessionDescriptionInit> => {
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

/**
 * Set remote description
 */
export const setRemoteDescription = async (
  peerConnection: RTCPeerConnection,
  description: RTCSessionDescriptionInit
): Promise<void> => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(description));
};

/**
 * Add ICE candidate
 */
export const addIceCandidate = async (
  peerConnection: RTCPeerConnection,
  candidate: RTCIceCandidateInit
): Promise<void> => {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
};

/**
 * Close peer connection
 */
export const closePeerConnection = (peerConnection: RTCPeerConnection): void => {
  peerConnection.close();
};

/**
 * Get connection state string
 */
export const getConnectionState = (peerConnection: RTCPeerConnection): string => {
  return peerConnection.connectionState;
};
