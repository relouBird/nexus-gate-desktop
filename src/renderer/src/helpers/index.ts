// utils/error.utils.ts
import type { AxiosResponse } from 'axios'

export function formatNumber(n: number): string {
  return n.toLocaleString('fr-FR')
}

export const dateFormat = (
  date: Date | string | number | null | undefined,
  format: string = 'dddd D MMMM YYYY',
  locale: string = 'fr-FR'
): string => {
  // Gestion des valeurs nulles ou indéfinies
  if (!date) return ''

  // Conversion en objet Date
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  // Formats prédéfinis pour une utilisation facile
  const formatPresets: Record<string, Intl.DateTimeFormatOptions> = {
    // Formats complets
    full: { dateStyle: 'full', timeStyle: 'long' },
    long: { dateStyle: 'long', timeStyle: 'short' },
    medium: { dateStyle: 'medium', timeStyle: 'medium' },
    short: { dateStyle: 'short', timeStyle: 'short' },

    // Formats date seulement
    'full-date': { dateStyle: 'full' },
    'long-date': { dateStyle: 'long' },
    'medium-date': { dateStyle: 'medium' },
    'short-date': { dateStyle: 'short' },

    // Formats time seulement
    'full-time': { timeStyle: 'full' },
    'long-time': { timeStyle: 'long' },
    'medium-time': { timeStyle: 'medium' },
    'short-time': { timeStyle: 'short' },

    // Formats personnalisés courants
    'dddd D MMMM YYYY': {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    'DD/MM/YYYY': {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    'DD/MM/YYYY HH:mm': {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    'YYYY-MM-DD': {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    'DD MMM YYYY': {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    },
    'DD MMM': {
      day: '2-digit',
      month: 'short'
    },
    'DD MMM YY': {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    },
    'HH:mm:ss': {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    'HH:mm': {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  }

  // Si le format correspond à un préréglage, l'utiliser
  if (formatPresets[format]) {
    return new Intl.DateTimeFormat(locale, formatPresets[format]).format(d)
  }

  // Support des formats personnalisés avec pattern matching
  const customOptions: Intl.DateTimeFormatOptions = {}

  // Détection des options basée sur le format string
  if (format.includes('dddd')) customOptions.weekday = 'long'
  else if (format.includes('ddd')) customOptions.weekday = 'short'
  else if (format.includes('dd')) customOptions.weekday = 'short'

  if (format.includes('MMMM')) customOptions.month = 'long'
  else if (format.includes('MMM')) customOptions.month = 'short'
  else if (format.includes('MM')) customOptions.month = '2-digit'
  else if (format.includes('M')) customOptions.month = 'numeric'

  if (format.includes('DD')) customOptions.day = '2-digit'
  else if (format.includes('D')) customOptions.day = 'numeric'

  if (format.includes('YYYY')) customOptions.year = 'numeric'
  else if (format.includes('YY')) customOptions.year = '2-digit'

  if (format.includes('HH')) {
    customOptions.hour = '2-digit'
    customOptions.hour12 = false
  } else if (format.includes('hh')) {
    customOptions.hour = '2-digit'
    customOptions.hour12 = true
  } else if (format.includes('H')) {
    customOptions.hour = 'numeric'
    customOptions.hour12 = false
  } else if (format.includes('h')) {
    customOptions.hour = 'numeric'
    customOptions.hour12 = true
  }

  if (format.includes('mm')) customOptions.minute = '2-digit'
  else if (format.includes('m')) customOptions.minute = 'numeric'

  if (format.includes('ss')) customOptions.second = '2-digit'
  else if (format.includes('s')) customOptions.second = 'numeric'

  if (format.includes('A') || format.includes('a')) {
    customOptions.hour12 = true
  }

  // Si des options de timezone sont détectées
  if (format.includes('Z') || format.includes('z')) {
    customOptions.timeZoneName = 'short'
  }

  return new Intl.DateTimeFormat(locale, customOptions).format(d)
}

export function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}

export function extractErrorMessage(error: unknown): string {
  const errorHandle: AxiosResponse = error as AxiosResponse
  if (errorHandle.data) {
    const data = errorHandle.data
    if (data && typeof data === 'object') {
      // Si message est un tableau, prendre le premier élément
      if (Array.isArray(data.message) && data.message.length > 0) {
        return data.message[0]
      }
      // Sinon si message est une string
      if (typeof data.message === 'string') {
        return data.message
      }
    }
    return 'Une erreur est survenue'
  }
  if (error instanceof Error) return error.message
  return String(error)
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')

  if (!localPart || !domain) {
    return email
  }

  const visibleChars = Math.min(2, localPart.length)
  const visiblePart = localPart.slice(0, visibleChars)
  const maskedPart = '*'.repeat(Math.max(0, localPart.length - visibleChars))

  return `${visiblePart}${maskedPart}@${domain}`
}
