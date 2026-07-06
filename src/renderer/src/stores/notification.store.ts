import { create } from 'zustand'

type NotificationStoreState = {
  color: 'error' | 'success'
  message: string | null
  timeout: number
  visible: boolean
  options: Record<string, unknown>
}

type NotificationStoreActions = {
  getNotification: () => NotificationStoreState
  isVisible: () => boolean
  close: () => void
  show: () => void
  setNotification: (options: Record<string, unknown>) => void
}

export const useNotificationStore = create<NotificationStoreState & NotificationStoreActions>(
  (set, get) => ({
    color: 'success',
    message: null,
    timeout: 5000,
    visible: false,
    options: {},

    // Méthodes disponibles pour mettre à jour le store
    // GETTERS
    getNotification: () => {
      return get()
    },
    isVisible: () => get().visible,
    // SETTERS
    close: () => set(() => ({ visible: false })),
    show: () => set(() => ({ visible: true })),
    setNotification: (options: Record<string, unknown>) => {
      set({
        message: options.message as string,
        color: options.color as 'error' | 'success',
        timeout: options.timeout as number,
        options
      })
    }
  })
)
