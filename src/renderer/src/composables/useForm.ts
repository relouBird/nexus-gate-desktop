// import { reactive, computed } from "vue";
import * as yup from 'yup'
import type { AxiosResponse } from 'axios'
import { isAxiosError } from 'axios'
import { useMemo, useRef, useState } from 'react'
import { UseFormProps } from '@/types/form.type'

export default function useForm<T extends Record<string, unknown>>(
  schema: yup.ObjectSchema<T>,
  initialValues: Partial<T> = {}
): UseFormProps<T> {
  // On fige les valeurs initiales dans une ref pour éviter les recréations d'objets
  const defaultValues = useRef(initialValues)

  const [formData, setFormData] = useState<T>({
    ...defaultValues.current
  } as T)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [processing, setProcessing] = useState(false)

  const isInValid = useMemo(() => {
    return Object.values(errors).some((e) => e.length > 0)
  }, [errors])

  const isValid = useMemo(() => !isInValid, [isInValid])

  function isValidationError(error: unknown): error is yup.ValidationError {
    return error instanceof yup.ValidationError
  }

  // INDISPENSABLE EN REACT : Pour lier vos inputs (ex: onChange={(e) => setData('nom', e.target.value)})
  function setData(key: keyof T, value: unknown): void {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  async function validate(): Promise<boolean> {
    try {
      await schema.validate(formData, { abortEarly: false })
      clearErrors()
      return true
    } catch (err: unknown) {
      clearErrors()
      const localErrors: Record<string, string[]> = {}

      if (isValidationError(err) && err.inner) {
        err.inner.forEach((e: yup.ValidationError) => {
          if (e.path) {
            if (!localErrors[e.path]) localErrors[e.path] = []
            localErrors[e.path].push(e.message)
          }
        })
      }
      setErrors(localErrors)
      return false
    }
  }

  async function validateField(field: keyof T): Promise<void> {
    try {
      await schema.validateAt(field as string, formData)
      setErrors((prev) => ({
        ...prev,
        [field as string]: [] // Copie immutable
      }))
    } catch (err: unknown) {
      setErrors((prev) => ({
        ...prev,
        [field as string]: isValidationError(err) ? [err.message] : []
      }))
    }
  }

  async function submit(handler: () => Promise<AxiosResponse>): Promise<AxiosResponse | null> {
    const valid = await validate()
    if (!valid) return null

    setProcessing(true)

    try {
      const response = await handler()
      clearErrors()
      return response
    } catch (err: unknown) {
      console.error('Submit error:', err)
      if (isAxiosError(err) && err.response?.data?.errors) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...err.response?.data.errors
        }))
      }
      return isAxiosError(err) ? err.response || null : null
    } finally {
      setProcessing(false)
    }
  }

  function reset(values?: Partial<T>): void {
    setFormData(() => ({
      ...formData,
      ...(values || defaultValues.current)
    }))
    setErrors({})
  }

  function clearErrors(): void {
    setErrors({})
  }

  return {
    data: formData,
    setData,
    errors,
    isValid,
    isInValid,
    processing,
    submit,
    validate,
    validateField,
    reset,
    clear: clearErrors
  }
}
