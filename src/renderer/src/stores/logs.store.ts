// stores/log.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AxiosResponse } from 'axios'
import logService from '@/services/logs.service'
import type { GetLogsParams, GetLogsResponse } from '@/types/logs.type'
import type { NotifyFn } from '@/helpers/notifications.helper'
import type { RequestLog } from '@/types/nexusgate.type'

// ─── État ────────────────────────────────────────────────────

type LogStoreState = {
  logs: RequestLog[]
  total: number
  page: number
  pages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// ─── Actions ─────────────────────────────────────────────────

type LogStoreActions = {
  getLogs: (params?: GetLogsParams, notify?: NotifyFn) => Promise<AxiosResponse<GetLogsResponse>>

  reset: () => void
  setLogs: (logs: RequestLog[]) => void
}

// ─── État initial ─────────────────────────────────────────────

const INITIAL_STATE: LogStoreState = {
  logs: [],
  total: 0,
  page: 1,
  pages: 0,
  hasNextPage: false,
  hasPreviousPage: false
}

// ─── Store ────────────────────────────────────────────────────

export const useLogStore = create<LogStoreState & LogStoreActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      getLogs: async (params, notify) => {
        try {
          const service = logService()

          console.log('Fetching logs with params:', params)

          const response = await service.getLogs(params)

          if (response.status === 200 || response.status === 201) {
            const { data, pagination } = response.data
            set({
              logs: data ?? [],
              total: pagination?.total ?? 0,
              page: pagination?.page ?? 1,
              pages: pagination?.pages ?? 0,
              hasNextPage: pagination?.hasNextPage ?? false,
              hasPreviousPage: pagination?.hasPreviousPage ?? false
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer les logs.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      reset: () => set({ ...INITIAL_STATE }),
      setLogs: (logs) => set({ logs, total: logs.length })
    }),
    {
      name: 'log-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

// ─── Sélecteurs ───────────────────────────────────────────────

export const selectLogs = (s: LogStoreState): RequestLog[] => s.logs
export const selectLogTotal = (s: LogStoreState): number => s.total
export const selectLogPage = (s: LogStoreState): number => s.page
export const selectLogPages = (s: LogStoreState): number => s.pages
export const selectLogHasNext = (s: LogStoreState): boolean => s.hasNextPage
export const selectLogHasPrevious = (s: LogStoreState): boolean => s.hasPreviousPage
