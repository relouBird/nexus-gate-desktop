// stores/rule.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AxiosResponse } from 'axios'
import ruleService from '@/services/rule.service'
import type {
  CreateRuleResponse,
  GetRulesResponse,
  GetRuleResponse,
  UpdateRuleResponse,
  DeleteRuleResponse,
  GetAllRulesResponse,
  CreateRulePayload,
  UpdateRulePayload
} from '@/types/rule.type'
import type { NotifyFn } from '@/helpers/notifications.helper'
import type { Rule } from '@/types/nexusgate.type'

// ─── État ────────────────────────────────────────────────────

type RuleStoreState = {
  rule: Rule | null
  rules: Rule[]
  allRules: Rule[] // Pour la recherche globale
  total: number
  totalAll: number // Total pour la recherche globale
}

// ─── Actions ─────────────────────────────────────────────────

type RuleStoreActions = {
  createRule: (
    payload: CreateRulePayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<CreateRuleResponse>>

  getRule: (id: string, notify?: NotifyFn) => Promise<AxiosResponse<GetRuleResponse>>

  getManyRule: (serverId: string, notify?: NotifyFn) => Promise<AxiosResponse<GetRulesResponse>>

  getAllRules: (notify?: NotifyFn) => Promise<AxiosResponse<GetAllRulesResponse>>

  updateRule: (
    payload: UpdateRulePayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<UpdateRuleResponse>>

  deleteRule: (id: string, notify?: NotifyFn) => Promise<AxiosResponse<DeleteRuleResponse>>

  reset: () => void
  setRule: (rule: Rule | null) => void
  setRules: (rules: Rule[]) => void
  setAllRules: (rules: Rule[]) => void
  setTotal: (total: number) => void
  setTotalAll: (total: number) => void
}

// ─── État initial ─────────────────────────────────────────────

const INITIAL_STATE: RuleStoreState = {
  rule: null,
  rules: [],
  allRules: [],
  total: 0,
  totalAll: 0
}

// ─── Store ────────────────────────────────────────────────────

export const useRuleStore = create<RuleStoreState & RuleStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      createRule: async (payload, notify) => {
        try {
          const service = ruleService()
          const response = await service.createRule(payload)

          if (response.status === 200 || response.status === 201) {
            const created = response.data.rule ?? null
            if (created) {
              set({
                rule: created,
                rules: [...get().rules, created],
                allRules: [...get().allRules, created]
              })
            }
          }

          notify?.({
            message: response.data?.message ?? 'Règle créée avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de créer la règle.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getRule: async (id, notify) => {
        try {
          const service = ruleService()
          const response = await service.getRule(id)

          if (response.status === 200 || response.status === 201) {
            const rule = response.data?.rule ?? null
            set({ rule })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer la règle.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getManyRule: async (serverId, notify) => {
        try {
          const service = ruleService()
          const response = await service.getManyRule(serverId)

          if (response.status === 200 || response.status === 201) {
            const rules = response.data?.rules ?? []
            const total = response.data?.total ?? rules.length

            set({
              rules,
              total
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer les règles.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getAllRules: async (notify) => {
        try {
          const service = ruleService()
          const response = await service.getAllRules()

          if (response.status === 200 || response.status === 201) {
            const rules = response.data?.rules ?? []
            const total = response.data?.total ?? rules.length

            set({
              allRules: rules,
              totalAll: total
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer toutes les règles.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      updateRule: async (payload, notify) => {
        try {
          const service = ruleService()
          const response = await service.updateRule(payload)

          if (response.status === 200 || response.status === 201) {
            const updated = response.data?.rule ?? null
            if (updated) {
              set({
                rule: updated,
                rules: get().rules.map((x) => (x.id === updated.id ? updated : x)),
                allRules: get().allRules.map((x) => (x.id === updated.id ? updated : x))
              })
            }
          }

          notify?.({
            message: response.data?.message ?? 'Règle modifiée avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de modifier la règle.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      deleteRule: async (id, notify) => {
        try {
          const service = ruleService()
          const response = await service.deleteRule(id)

          set((state) => ({
            rules: state.rules.filter((r) => r.id !== id),
            allRules: state.allRules.filter((r) => r.id !== id),
            rule: state.rule && state.rule.id === id ? null : state.rule,
            total: Math.max(0, state.total - 1),
            totalAll: Math.max(0, state.totalAll - 1)
          }))

          notify?.({
            message: 'Règle supprimée avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de supprimer la règle.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      reset: () => set({ ...INITIAL_STATE }),
      setRule: (rule) => set({ rule }),
      setRules: (rules) => set({ rules, total: rules.length }),
      setAllRules: (rules) => set({ allRules: rules, totalAll: rules.length }),
      setTotal: (total) => set({ total }),
      setTotalAll: (total) => set({ totalAll: total })
    }),
    {
      name: 'rule-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

// ─── Sélecteurs ───────────────────────────────────────────────

export const selectRule = (s: RuleStoreState): Rule | null => s.rule
export const selectRules = (s: RuleStoreState): Rule[] => s.rules
export const selectAllRules = (s: RuleStoreState): Rule[] => s.allRules
export const selectTotalRules = (s: RuleStoreState): number => s.total
export const selectTotalAllRules = (s: RuleStoreState): number => s.totalAll
