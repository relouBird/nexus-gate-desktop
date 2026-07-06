// components/display/AccessDenied.tsx
import { useNavigate } from 'react-router'
import { cn } from '@/utils/cn'

interface AccessDeniedProps {
  /** Message principal affiché sous l'icône */
  title?: string
  /** Description explicative */
  description?: string
  /** Rôles autorisés à afficher dans le message (ex: ["CREATOR", "ADMIN"]) */
  allowedRoles?: string[]
  /** Label du bouton retour — false pour le cacher */
  backLabel?: string | false
  /** Override du chemin retour — par défaut navigate(-1) */
  backPath?: string
  className?: string
}

export default function AccessDenied({
  title = 'Accès restreint',
  description,
  allowedRoles,
  backLabel = '← Retour',
  backPath,
  className
}: AccessDeniedProps): React.JSX.Element {
  const navigate = useNavigate()

  const defaultDescription = allowedRoles?.length
    ? `Seul${allowedRoles.length > 1 ? 's' : ''} le${allowedRoles.length > 1 ? 's' : ''} rôle${allowedRoles.length > 1 ? 's' : ''} ${allowedRoles.map((r) => `<strong>${r}</strong>`).join(' et ')} peu${allowedRoles.length > 1 ? 'vent' : 't'} accéder à cette page.`
    : "Vous n'avez pas les droits nécessaires pour accéder à cette page."

  function handleBack(): void {
    if (backPath) navigate(backPath)
    else navigate(-1)
  }

  return (
    <div className={cn('flex flex-col items-center gap-4 py-20 text-center', className)}>
      {/* Icône cadenas */}
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 text-gray-400"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Textes */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p
          className="text-xs text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: description ?? defaultDescription
          }}
        />
      </div>

      {/* Bouton retour */}
      {backLabel !== false && (
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors mt-1"
        >
          {backLabel}
        </button>
      )}
    </div>
  )
}
