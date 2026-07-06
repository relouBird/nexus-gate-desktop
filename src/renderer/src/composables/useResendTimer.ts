// ─── Timer renvoi ─────────────────────────────────────────────

import { useState, useEffect } from 'react'

const RESEND_COOLDOWN = 60 // secondes

export interface UseResendTimerProps {
  seconds: number
  canResend: boolean
  reset: () => void
}

export function useResendTimer(COUNTDOW: number = RESEND_COOLDOWN): UseResendTimerProps {
  const [seconds, setSeconds] = useState(COUNTDOW)

  const canResend = seconds <= 0

  useEffect(() => {
    if (seconds <= 0) return

    const id = setTimeout(() => {
      setSeconds((s) => s - 1)
    }, 1000)

    return () => clearTimeout(id)
  }, [seconds])

  function reset(): void {
    setSeconds(COUNTDOW)
  }

  return { seconds, canResend, reset }
}
