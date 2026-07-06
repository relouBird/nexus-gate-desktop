import { AxiosResponse } from 'axios'

export interface UseFormProps<T> {
  data: T
  setData: (key: keyof T, value: unknown) => void
  errors: Record<string, string[]>
  isValid: boolean
  isInValid: boolean
  processing: boolean
  submit: (handler: () => Promise<AxiosResponse>) => Promise<AxiosResponse | null>
  validate: () => Promise<boolean>
  validateField: (field: keyof T) => Promise<void>
  reset: (values?: Partial<T>) => void
  clear: () => void
}
