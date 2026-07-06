import { useNotificationStore } from '@/stores/notification.store'
import { useStore } from 'zustand'

type NotificationType = {
  color: 'success' | 'error' | 'warning' | 'info'
  message: string | null
  timeout?: number
  visible: boolean
}

export type NotifyFn = (options: {
  message: string
  color: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
  visible: boolean
}) => void

/**
 * Notifie le frontend en passant par le store (notificationStore)
 * @param message
 * @param color
 * @param config
 */
export const useNotify = () => {
  const { show, setNotification } = useStore(useNotificationStore)

  return (options: NotificationType, config: Record<string, unknown> = {}) => {
    if (typeof options === 'object') {
      config = { ...options }
    }
    setNotification(config)
    show()
  }
}
