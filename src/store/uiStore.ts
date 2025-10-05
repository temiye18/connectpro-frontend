import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  toggleSidebar: () => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setChatOpen: (isOpen: boolean) => void;
  setParticipantsOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isChatOpen: false,
  isParticipantsOpen: true,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  toggleParticipants: () => set((state) => ({ isParticipantsOpen: !state.isParticipantsOpen })),

  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  setParticipantsOpen: (isOpen) => set({ isParticipantsOpen: isOpen }),
}));
