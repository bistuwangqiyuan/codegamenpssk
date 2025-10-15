import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  isAIChatOpen: boolean
  isPreviewFullscreen: boolean
  theme: 'light' | 'dark'
  
  // Actions
  toggleSidebar: () => void
  toggleAIChat: () => void
  togglePreviewFullscreen: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isAIChatOpen: false,
  isPreviewFullscreen: false,
  theme: 'light',

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleAIChat: () => set((state) => ({ isAIChatOpen: !state.isAIChatOpen })),
  togglePreviewFullscreen: () => set((state) => ({ isPreviewFullscreen: !state.isPreviewFullscreen })),
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
}))

