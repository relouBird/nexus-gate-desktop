import { create } from 'zustand'
import type { CatType } from '@/types/cat.type'
import type { AxiosResponse } from 'axios'
import catService from '@/services/cat.service'

type CatStoreState = {
  cats: CatType[]
  selectedCat: CatType | null
}

type CatStoreActions = {
  fetchCats: () => Promise<void>
  fetchCatById: (id: string) => Promise<void>
  createCat: (payload: CatType) => Promise<void>
  updateCat: (id: string, payload: CatType) => Promise<void>
  deleteCat: (id: string) => Promise<void>
  setSelectedCat: (cat: CatType | null) => void
}

export const useCatStore = create<CatStoreState & CatStoreActions>((set, get) => ({
  cats: [],
  selectedCat: null,
  fetchCats: async () => {
    try {
      const service = catService()

      if (!service.fetchAll) return

      const response: AxiosResponse<CatType[]> = (await service.fetchAll(
        {}
      )) as unknown as AxiosResponse<CatType[]>

      if (response.status === 200 || response.status === 201) {
        set({
          cats: response.data,
          selectedCat: response.data[0] || null
        })
      }
    } catch (error) {
      console.error('Failed to fetch cats:', error)
      throw error // 🔥 IMPORTANT
    }
  },
  fetchCatById: async (id: string) => {
    try {
      const service = catService()

      if (!service.fetch) return

      const response: AxiosResponse<CatType> = await service.fetch(id, {})

      if (response.status === 200 || response.status === 201) {
        set({
          cats: [response.data],
          selectedCat: response.data
        })
      }
    } catch (error) {
      console.error('Failed to fetch cat:', error)
      throw error // 🔥 IMPORTANT
    }
  },
  createCat: async (payload: CatType) => {
    try {
      const service = catService()

      if (!service.create) return

      const response: AxiosResponse<CatType> = await service.create(payload)

      if (response.status === 200 || response.status === 201) {
        const currentCats = get().cats

        set({
          cats: [response.data, ...currentCats],
          selectedCat: response.data
        })
      }
    } catch (error) {
      console.error('Failed to create cat:', error)
      throw error // 🔥 IMPORTANT
    }
  },
  updateCat: async (id: string, payload: CatType) => {
    try {
      const service = catService()

      if (!service.update) return

      const response: AxiosResponse<CatType> = await service.update(id, payload)

      if (response.status === 200 || response.status === 201) {
        const updatedCat = response.data

        const updatedList = get().cats.map((cat) => (cat.id === Number(id) ? updatedCat : cat))

        set({
          cats: updatedList,
          selectedCat: updatedCat
        })
      }
    } catch (error) {
      console.error('Failed to update cat:', error)
      throw error // 🔥 IMPORTANT
    }
  },
  deleteCat: async (id: string) => {
    try {
      const service = catService()

      if (!service.remove) return

      const response: AxiosResponse<CatType> = await service.remove(id, {})

      if (response.status === 200 || response.status === 201) {
        const filtered = get().cats.filter((cat) => cat.id !== Number(id))

        set({
          cats: filtered,
          selectedCat: filtered[0] || null
        })
      }
    } catch (error) {
      console.error('Failed to delete cat:', error)
      throw error // 🔥 IMPORTANT
    }
  },
  setSelectedCat: (cat: CatType | null) => set({ selectedCat: cat })
}))
