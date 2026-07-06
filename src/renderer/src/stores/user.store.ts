// stores/user.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AxiosResponse } from 'axios'
import userService from '@/services/user.service'
import type {
  GetUserResponse,
  GetUsersResponse,
  CreateUserResponse,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserResponse,
  DeleteUserResponse
} from '@/types/user.type'
import type { NotifyFn } from '@/helpers/notifications.helper'
import type { UserModel } from '@/types/nexusgate.type'

// ─── État ────────────────────────────────────────────────────

type UserStoreState = {
  user: UserModel | null
  users: UserModel[]
  total: number
}

// ─── Actions ─────────────────────────────────────────────────

type UserStoreActions = {
  createUser: (
    payload: CreateUserPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<CreateUserResponse>>

  getUser: (id: string, notify?: NotifyFn) => Promise<AxiosResponse<GetUserResponse>>

  getManyUser: (notify?: NotifyFn) => Promise<AxiosResponse<GetUsersResponse>>

  updateUser: (
    payload: UpdateUserPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<UpdateUserResponse>>

  deleteUser: (id: string, notify?: NotifyFn) => Promise<AxiosResponse<DeleteUserResponse>>

  reset: () => void
  setUser: (user: UserModel | null) => void
  setUsers: (users: UserModel[]) => void
  setTotal: (total: number) => void
}

// ─── État initial ─────────────────────────────────────────────

const INITIAL_STATE: UserStoreState = {
  user: null,
  users: [],
  total: 0
}

// ─── Store ────────────────────────────────────────────────────

export const useUserStore = create<UserStoreState & UserStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      createUser: async (payload, notify) => {
        try {
          const service = userService()
          const response = await service.createUser(payload)

          if (response.status === 200 || response.status === 201) {
            const created = response.data.user ?? null
            if (created) set({ user: created, users: [...get().users, created] })
          }

          notify?.({
            message: response.data?.message ?? 'Utilisateur créé avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible de créer l'utilisateur.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getUser: async (id, notify) => {
        try {
          const service = userService()
          const response = await service.getUser(id)

          if (response.status === 200 || response.status === 201) {
            const user = response.data?.user ?? null
            set({ user })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible de récupérer l'utilisateur.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getManyUser: async (notify) => {
        try {
          console.log('STORE GET MANY USER')
          const service = userService()
          const response = await service.getManyUser()

          if (response.status === 200 || response.status === 201) {
            const users = response.data?.users ?? []
            const total = response.data?.total ?? users.length

            set({
              users,
              total
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer les utilisateurs.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      updateUser: async (payload, notify) => {
        try {
          const service = userService()
          const response = await service.updateUser(payload)

          if (response.status === 200 || response.status === 201) {
            const updated = response.data?.user ?? null
            if (updated)
              set({
                user: updated,
                users: get().users.map((x) => (x.id === updated.id ? updated : x))
              })
          }

          notify?.({
            message: response.data?.message ?? 'Utilisateur modifié avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible de modifier l'utilisateur.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      deleteUser: async (id, notify) => {
        try {
          const service = userService()
          const response = await service.deleteUser(id)

          set((state) => ({
            users: state.users.filter((u) => u.id !== id),
            user: state.user && state.user.id === id ? null : state.user,
            total: Math.max(0, state.total - 1)
          }))

          notify?.({
            message: 'Utilisateur supprimé avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible de supprimer l'utilisateur.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      reset: () => set({ ...INITIAL_STATE }),
      setUser: (user) => set({ user }),
      setUsers: (users) => set({ users, total: users.length }),
      setTotal: (total) => set({ total })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

// ─── Sélecteurs ───────────────────────────────────────────────

export const selectUser = (s: UserStoreState): UserModel | null => s.user
export const selectUsers = (s: UserStoreState): UserModel[] => s.users
export const selectTotalUsers = (s: UserStoreState): number => s.total
