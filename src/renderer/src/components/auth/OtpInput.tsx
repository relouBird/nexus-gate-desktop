// components/auth/OtpInput.tsx
/**
 * Input OTP à cases individuelles.
 * - 6 cases sur desktop, 4 sur mobile (< 480px)
 * - Navigation clavier : ArrowLeft/Right, Backspace, coller (paste)
 * - Accessibilité : aria-label par case, role="group"
 */
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ClipboardEvent,
  type KeyboardEvent,
  useMemo
} from 'react'
import { cn } from '@/utils/cn'

interface OtpInputProps {
  length: number
  value: string
  onChange: (value: string) => void
  hasError?: boolean
  disabled?: boolean
  autoFocus?: boolean
}

export function OtpInput({
  length,
  value,
  onChange,
  hasError,
  disabled,
  autoFocus
}: OtpInputProps): React.JSX.Element {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [newDigits, setNewDigits] = useState<string[] | undefined>(undefined)
  const digits = useMemo(() => {
    if (newDigits) return newDigits
    return Array.from({ length }, (_, i) => value?.[i] ?? '')
  }, [newDigits, length, value])

  const focusAt = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(length - 1, index))
      inputsRef.current[target]?.focus()
    },
    [length]
  )

  useEffect(() => {
    if (autoFocus) focusAt(0)
  }, [autoFocus, focusAt])

  function commit(newDigits: string[]): void {
    setNewDigits(newDigits)
    onChange(newDigits.join(''))
  }

  function handleChange(index: number, raw: string): void {
    // Garde uniquement le dernier chiffre saisi
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    commit(next)
    if (digit) focusAt(index + 1)
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...digits]
      if (digits[index]) {
        next[index] = ''
        commit(next)
      } else {
        focusAt(index - 1)
        next[index - 1] = ''
        commit(next)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(index + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>): void {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const next = Array.from({ length }, (_, i) => pasted[i] ?? '')
    commit(next)
    focusAt(Math.min(pasted.length, length - 1))
  }

  return (
    <div
      role="group"
      aria-label="Code de vérification"
      className="flex items-center justify-center gap-2.5 sm:gap-3"
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i] ?? ''}
          aria-label={`Chiffre ${i + 1} sur ${length}`}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            // Base
            'w-11 h-13 sm:w-12 sm:h-14 rounded-xl border-2 text-center text-xl font-semibold',
            'bg-background-50 text-title-50 font-mono',
            'transition-all duration-150',
            // Focus
            'focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30',
            'focus:bg-white focus:-translate-y-0.5 focus:shadow-md',
            // Hover
            'hover:border-base-300',
            // Rempli
            digits[i] ? 'border-primary-300 bg-primary-50/40' : 'border-base-200',
            // Erreur
            hasError &&
              'border-error-300 bg-error-50/30 focus:border-error-400 focus:ring-error-200/30',
            // Disabled
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      ))}
    </div>
  )
}
