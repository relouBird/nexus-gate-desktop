// components/ui/ToastLeft.tsx
// Variante A — barre gauche qui suit l'arrondi du composant (overflow:hidden)
import { cn } from '@/utils/cn'
import { CheckCircle1, Close, Envelope1, InfoCircle, XmarkCircle } from '@tailgrids/icons'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { linkStyles } from '@/constants/ui/link.constant'
import type { ToastVariant } from '@/constants/ui/toast.constant'

// ─── Helpers ──────────────────────────────────────────────────

/** Couleur de la barre gauche */
const leftBarVariant: Record<ToastVariant, string> = {
  success: 'before:bg-success-500',
  error: 'before:bg-error-500',
  warning: 'before:bg-warning-500',
  info: 'before:bg-primary-500',
  default: 'before:bg-base-300'
}

/** Icône : fond teinté + couleur */
const iconBgVariant: Record<ToastVariant, string> = {
  success: 'bg-success-50 text-success-500',
  error: 'bg-error-50 text-error-500',
  warning: 'bg-warning-50 text-warning-500',
  info: 'bg-primary-50 text-primary-500',
  default: 'bg-background-soft-100 text-foreground-soft-500'
}

function getIcon(variant: ToastVariant): React.JSX.Element {
  switch (variant) {
    case 'success':
      return <CheckCircle1 />
    case 'error':
      return <XmarkCircle />
    case 'warning':
      return <InfoCircle />
    case 'info':
      return <InfoCircle />
    case 'default':
      return <Envelope1 />
  }
}

// ─── Types ────────────────────────────────────────────────────

type MessageType = string | { title: string; description: string }

type PropsType = {
  variant?: ToastVariant
  undoAction?: () => void
  onClose?: () => void
  message: MessageType
  children?: React.ReactNode
  hideIcon?: boolean
  icon?: React.ReactNode
}

// ─── Toast ────────────────────────────────────────────────────

export function Toast({
  variant = 'default',
  undoAction,
  onClose,
  message,
  children,
  hideIcon,
  icon
}: PropsType): React.JSX.Element {
  const isObject = typeof message === 'object'

  return (
    /**
     * overflow-hidden : le ::before (barre gauche 3px) est absolu,
     * il est clampé par le border-radius du wrapper.
     * pl-[calc(0.75rem+3px)] compense la barre pour ne pas écraser le contenu.
     */
    <div
      className={cn(
        // Layout
        'relative overflow-hidden',
        'flex min-w-96.25 max-w-112.5 items-center gap-3',
        'rounded-lg border border-base-200 bg-background-100 shadow-sm',
        // Padding : 3px à gauche pour la barre
        'py-3 pr-3 pl-3.75',
        // Barre gauche via before
        'before:absolute before:left-0 before:top-1/2 before:-translate-1/2 before:w-1 before:h-7',
        leftBarVariant[variant],
        // Ajustements
        isObject && 'items-start',
        hideIcon && 'py-2'
      )}
    >
      {/* Icône dans carré teinté */}
      {!hideIcon && (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center',
            'h-7 w-7 rounded-[7px] text-base',
            iconBgVariant[variant]
          )}
        >
          {icon || getIcon(variant)}
        </span>
      )}

      {/* Corps */}
      <div
        className={cn(
          isObject ? 'flex flex-col gap-0.5' : 'contents',
          !isObject && hideIcon && 'ml-1'
        )}
      >
        {/* Titre (message objet uniquement) */}
        {isObject && <h4 className="text-sm font-semibold text-title-50">{message.title}</h4>}

        {/* Texte */}
        <p
          className={cn(
            isObject ? 'text-xs text-text-100' : 'text-sm font-medium text-title-50',
            !isObject && hideIcon && 'ml-1'
          )}
        >
          {isObject ? message.description : message}
        </p>

        {children}
      </div>

      {/* Undo (message simple uniquement) */}
      {!isObject && undoAction && (
        <button
          type="button"
          className={linkStyles({
            variant: 'primary',
            className: 'ml-auto shrink-0'
          })}
          onClick={undoAction}
        >
          Annuler
        </button>
      )}

      {/* Bouton fermer */}
      <Button
        variant="ghost"
        size="xs"
        iconOnly
        onClick={onClose}
        className={cn(
          isObject ? 'absolute top-1 right-1' : 'ml-auto shrink-0',
          !undoAction && !isObject && 'ml-auto'
        )}
      >
        <span className="sr-only">Fermer</span>
        <Close />
      </Button>
    </div>
  )
}

// ─── AvatarToast ──────────────────────────────────────────────

type AvatarToastProps = {
  name: string
  description: string
  image?: string
  status: 'none' | 'online' | 'offline' | 'busy'
  time: string
}

export function AvatarToast({
  name,
  description,
  image,
  status,
  time
}: AvatarToastProps): React.JSX.Element {
  return (
    <div className="relative overflow-hidden flex min-w-89.5 items-start gap-4 rounded-lg border border-base-200 bg-background-100 py-5 pr-5 pl-5.75 shadow-sm before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.75 before:bg-primary-500">
      <Avatar
        src={image}
        alt={'Image de ' + name}
        status={status}
        fallback={name.charAt(0)}
        size="lg"
      />
      <div>
        <h4 className="text-sm font-semibold text-title-50">{name}</h4>
        <p className="text-sm text-text-100">{description}</p>
        <p className="mt-2 text-xs text-primary-500">{time}</p>
      </div>
      <Button variant="ghost" size="xs" iconOnly className="absolute top-1 right-1">
        <span className="sr-only">Fermer</span>
        <Close />
      </Button>
    </div>
  )
}
