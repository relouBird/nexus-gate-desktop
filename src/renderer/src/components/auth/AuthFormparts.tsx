// components/auth/AuthFormParts.tsx
/**
 * Primitives partagées entre LoginPage et RegisterPage.
 * Autonomes : pas de dépendance externe autre que React.
 */
import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { ErrorCircle1, Eye, EyeDisabled, Locked3 } from '@tailgrids/icons'
import { Spinner } from '../ui/Spinner'

// ─── Field wrapper ─────────────────────────────────────────────

export function Field({
  label,
  htmlFor,
  error,
  small = false,
  children
}: {
  label: string
  htmlFor: string
  error?: string
  small?: boolean
  children: ReactNode
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className={
          small
            ? 'text-xs font-medium text-gray-500'
            : 'text-sm font-medium text-foreground-soft-500'
        }
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-error-500 flex items-center gap-1.5" role="alert">
          <ErrorCircle1 className="w-4 h-4 text-error-500" />
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Text input ───────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
  readOnly?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  mono?: boolean
}

export function AuthInput({
  hasError,
  readOnly,
  leftIcon,
  rightIcon,
  mono,
  className,
  ...props
}: InputProps): React.JSX.Element {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-soft-500/50 pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        className={cn(
          'w-full rounded-xl border  px-3.5 py-2.5 text-sm text-title-50',
          'placeholder:text-foreground-soft-500/40',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-300/40 focus:border-primary-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError
            ? 'border-error-300 focus:border-error-400 focus:ring-error-200/40'
            : 'border-slate-200 hover:border-base-200',
          mono && 'font-mono',
          readOnly
            ? 'bg-gray-50 text-gray-400 cursor-default border-gray-100'
            : 'bg-background-50 border-slate-200 hover:border-base-300',
          leftIcon && 'pl-9',
          className
        )}
        readOnly={readOnly}
        {...props}
      />

      {rightIcon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-soft-500/50 pointer-events-none">
          {rightIcon}
        </span>
      )}
    </div>
  )
}

// ─── Password input ───────────────────────────────────────────

export function PasswordInput({
  hasError,
  ...props
}: Omit<InputProps, 'type' | 'leftIcon'>): React.JSX.Element {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      {/* Lock icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-soft-500/50 pointer-events-none">
        <Locked3 className="w-5 h-5" />
      </span>
      <input
        type={visible ? 'text' : 'password'}
        className={cn(
          'w-full rounded-xl border bg-background-50 pl-9 pr-10 py-2.5 text-sm text-title-50',
          'placeholder:text-foreground-soft-500/40',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-300/40 focus:border-primary-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError
            ? 'border-error-300 focus:border-error-400 focus:ring-error-200/40'
            : 'border-slate-200 hover:border-base-200'
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-soft-500/40 hover:text-foreground-soft-500 transition-colors outline-none focus:outline-none"
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {visible ? <EyeDisabled /> : <Eye />}
      </button>
    </div>
  )
}

// ─── Submit button ────────────────────────────────────────────

export function SubmitButton({
  loading,
  label,
  disabled,
  loadingLabel,
  rightIcon
}: {
  loading: boolean
  label: string
  disabled?: boolean
  loadingLabel: string
  rightIcon?: ReactNode
}): React.JSX.Element {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        'w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white',
        'bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
        'transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-primary-300/60 focus:ring-offset-1',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'flex items-center justify-center gap-2'
      )}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          {loadingLabel}
        </>
      ) : (
        <span className="flex justify-center items-center gap-2">
          {label}
          {rightIcon && <span className="pointer-events-none">{rightIcon}</span>}
        </span>
      )}
    </button>
  )
}

// ─── Divider ──────────────────────────────────────────────────

export function AuthDivider({ label }: { label: string }): React.JSX.Element {
  return (
    <div className="relative flex items-center gap-3" role="separator" aria-label={label}>
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-foreground-soft-500/50 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

// ─── Password strength indicator ──────────────────────────────

export function PasswordStrength({ password }: { password: string }): React.JSX.Element | null {
  const score = getStrengthScore(password)
  const levels = [
    { min: 0, label: '', color: 'bg-base-200' },
    { min: 1, label: 'Faible', color: 'bg-error-400' },
    { min: 2, label: 'Moyen', color: 'bg-warning-400' },
    { min: 3, label: 'Bon', color: 'bg-green-400' },
    { min: 4, label: 'Fort', color: 'bg-green-500' }
  ]
  const current = [...levels].reverse().find((l) => score >= l.min)!

  if (!password) return null

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= score ? current.color : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      {current.label && (
        <span className="text-xs text-foreground-soft-500/60 shrink-0">{current.label}</span>
      )}
    </div>
  )
}

function getStrengthScore(pwd: string): number {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}

export function SuccessBadge({ message }: { message: string }): React.JSX.Element {
  return (
    <span className="flex items-center gap-1.5 text-xs text-green-600">
      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M3.5 6l2 2L8.5 4.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {message}
    </span>
  )
}
