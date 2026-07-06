import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import type { ErrorBackend } from '@/types/error.type'
import { useAuthStore } from '@/stores/auth.store'
import { extractErrorMessage } from '@/helpers'

export default function axiosBuilder(): { api: AxiosInstance } {
  /**
   * axios setup to use mock service
   */

  const baseURL = import.meta.env.VITE_API_BASE_URL.replace(/"/g, '').trim()

  if (!baseURL) {
    console.error('VITE_API_BASE_URL is not defined')
  }

  const api = axios.create({
    baseURL: baseURL,
    method: 'get'
  })

  /**
   * Se produit juste avant l'envoi de la requête
   */
  api.interceptors.request.use((config) => {
    const requestId = config.headers['x-request-id'] ?? uuidv4()

    if (!config.headers['x-request-id']) {
      config.headers['x-request-id'] = requestId
      config.headers['ngrok-skip-browser-warning'] = requestId
    }

    if (config.headers && config.headers['Content-Type']) {
      delete config.headers['Content-Type']
    }

    if (
      !config.url?.includes('auth') ||
      !config.url?.includes('team/register') ||
      config.url?.includes('logout')
    ) {
      const accessToken = useAuthStore.getState().accessToken
      // console.log("ACCESS-TOKEN ===========>", accessToken);
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    console.log(`[${requestId}] api-request send -->`, config)

    return config
  })

  /**
   *  Se produit juste après que le serveur distant a repondu
   */
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error: AxiosError) => {
      console.log('AXIOS ERROR =>', error)
      console.log('RESPONSE =>', error.response)
      console.log('REQUEST =>', error.request)
      const response = error.response as AxiosResponse
      const message = extractErrorMessage(response)

      const status = response?.status

      if (status === 401) {
        useAuthStore.getState().reset()
      }

      const requestId = response.config.headers['X-Request-Id']

      console.log(`[${requestId}] api-response-error  -->`, response)
      console.log(`[${requestId}] api-response-error  -->`, message)

      throw {
        ...error.response,
        data: { message }
      } as AxiosResponse<ErrorBackend>

      //   return error;
    }
  )

  return {
    api
  }
}
