import axiosBuilder from '@/composables/axiosBuilder'
import type { AxiosResponse } from 'axios'

export const request = async (
  uri: string,
  options: Record<string, unknown> = {}
): Promise<AxiosResponse> => {
  options.url = uri
  const { api } = axiosBuilder()
  return await api.request(options)
}
