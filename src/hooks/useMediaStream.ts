import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface MediaStreamOptions {
  video: boolean;
  audio: boolean;
}

/**
 * Hook to manage local media stream (camera and microphone)
 */
export const useMediaStream = (initialOptions: MediaStreamOptions = { video: true, audio: true }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(initialOptions.video);
  const [isAudioEnabled, setIsAudioEnabled] = useState(initialOptions.audio);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  // Get available media devices
  const getDevices = useCallback(async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      setDevices(deviceList);
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  }, []);

  // Get user media stream
  const getUserMedia = useCallback(async (constraints: MediaStreamConstraints) => {
    try {
      setIsLoading(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      // Update enabled states based on actual tracks
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      if (videoTracks.length > 0) {
        setIsVideoEnabled(videoTracks[0].enabled);
      }
      if (audioTracks.length > 0) {
        setIsAudioEnabled(audioTracks[0].enabled);
      }

      await getDevices();

      return stream;
    } catch (err) {
      const error = err as Error;
      let errorMessage = 'Failed to access camera/microphone';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera/microphone access denied. Please grant permissions.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera or microphone found on this device.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera/microphone is already in use by another application.';
      }

      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getDevices]);

  // Initialize media stream
  const startStream = useCallback(async () => {
    const constraints: MediaStreamConstraints = {
      video: isVideoEnabled ? {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
      } : false,
      audio: isAudioEnabled ? {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      } : false,
    };

    return await getUserMedia(constraints);
  }, [isVideoEnabled, isAudioEnabled, getUserMedia]);

  // Toggle video - stop/start track to release camera
  const toggleVideo = useCallback(async () => {
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];

    if (videoTrack) {
      // Turn off - stop the track completely to release camera
      videoTrack.stop();
      localStream.removeTrack(videoTrack);
      setIsVideoEnabled(false);
    } else {
      // Turn on - get new video track
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
        });
        const newVideoTrack = videoStream.getVideoTracks()[0];
        localStream.addTrack(newVideoTrack);
        setIsVideoEnabled(true);
      } catch (error) {
        console.error('Failed to start video:', error);
        toast.error('Failed to start camera');
      }
    }
  }, [localStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        const newState = !audioTrack.enabled;
        audioTrack.enabled = newState;
        setIsAudioEnabled(newState);
      }
    }
  }, [localStream]);

  // Stop all tracks
  const stopStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  }, [localStream]);

  // Switch camera (front/back on mobile)
  const switchCamera = useCallback(async () => {
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;

    const currentFacingMode = videoTrack.getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

    stopStream();

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: newFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: isAudioEnabled,
    };

    await getUserMedia(constraints);
  }, [localStream, isAudioEnabled, stopStream, getUserMedia]);

  // Replace video track with screen share
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      } as DisplayMediaStreamOptions);

      const screenTrack = screenStream.getVideoTracks()[0];

      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          localStream.removeTrack(videoTrack);
          videoTrack.stop();
        }
        localStream.addTrack(screenTrack);

        // Handle screen share stop
        screenTrack.onended = () => {
          stopScreenShare();
        };
      }

      return screenStream;
    } catch (err) {
      const error = err as Error;
      toast.error('Failed to start screen sharing');
      throw error;
    }
  }, [localStream]);

  // Stop screen share and restore camera
  const stopScreenShare = useCallback(async () => {
    if (!localStream) return;

    const screenTrack = localStream.getVideoTracks()[0];
    if (screenTrack) {
      localStream.removeTrack(screenTrack);
      screenTrack.stop();
    }

    // Restart camera
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
      },
    });

    const cameraTrack = cameraStream.getVideoTracks()[0];
    localStream.addTrack(cameraTrack);
  }, [localStream]);

  // Auto-start stream on mount
  useEffect(() => {
    let mounted = true;

    const initStream = async () => {
      try {
        await startStream();
      } catch (error) {
        console.error('Failed to initialize stream:', error);
      }
    };

    if (mounted) {
      initStream();
    }

    return () => {
      mounted = false;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    localStream,
    isVideoEnabled,
    isAudioEnabled,
    isLoading,
    error,
    devices,
    toggleVideo,
    toggleAudio,
    stopStream,
    startStream,
    switchCamera,
    startScreenShare,
    stopScreenShare,
  };
};
