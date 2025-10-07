import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket } from '@/src/lib/socket';
import { useAuthStore } from '@/src/store/authStore';

/**
 * Hook to manage Socket.IO connection lifecycle
 */
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuthStore();

  useEffect(() => {
    // Only initialize if we have token and user
    if (!token || !user) {
      return;
    }

    // Initialize socket connection
    const socketInstance = initializeSocket(token, user.name, user.email);
    setSocket(socketInstance);

    // Set up connection state listeners
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    // Set initial connection state
    setIsConnected(socketInstance.connected);

    // Cleanup on unmount
    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      // Don't disconnect here - let the app manage socket lifecycle
    };
  }, [token, user]);

  return {
    socket,
    isConnected,
    disconnect: disconnectSocket,
  };
};
