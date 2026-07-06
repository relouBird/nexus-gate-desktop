// layouts/LayoutAuth.tsx
import { Navigate, Outlet, useLocation } from 'react-router'
import BrandingGridIcon from '../icons/BrandingGridIcon'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'

// Import Image
import logo from '@/assets/logo.png'

/**
 * Layout pour les pages publiques : Login, Register.
 * Écran splitté : colonne gauche branding / colonne droite formulaire.
 * Sur mobile : plein écran formulaire uniquement.
 */
export function LayoutAuth(): React.JSX.Element {
  const location = useLocation()
  // Remplacez cette condition par votre vraie logique d'authentification (ex: token dans localStorage)
  const { accessToken } = useStore(useAuthStore)

  if (accessToken && location.pathname.includes('/login')) {
    return <Navigate to={'/'} replace />
  }
  return (
    <div className="min-h-screen flex font-sans bg-background-soft-50">
      {/* ── Colonne gauche — Branding (desktop uniquement) ── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between
                      bg-primary-950 overflow-hidden px-12 py-10 select-none"
      >
        {/* Grille de fond — texture subtile */}
        <BrandingGridIcon />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <img src={logo} alt="NexusGate" className="size-16 rounded-xl" />
          <span className="font-mono font-semibold text-white text-2xl tracking-tight leading-none">
            Nexus
            <br />
            <span className="text-primary-400">Gate</span>
          </span>
        </div>

        {/* Tagline centrale */}
        <div className="relative z-10 flex flex-col gap-5">
          <p className="text-3xl xl:text-4xl font-semibold text-white leading-snug max-w-xs">
            Une gateway,
            <br />
            <span className="text-primary-400">toutes vos APIs.</span>
          </p>
          <p className="text-sm text-white/50 leading-relaxed max-w-sm">
            Exposez, sécurisez et monitorez vos APIs cloud et locales depuis un point d&apos;entrée
            unique.
          </p>

          {/* Stats rapides */}
          <div className="flex items-center gap-6 pt-2">
            <Stat value="< 1ms" label="Vérif. token" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="3 rôles" label="Par équipe" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="Multi-tenant" label="Architecture" />
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-white/25 font-mono">
          NexusGate v1.0 — Draft interne
        </p>
      </div>

      {/* ── Colonne droite — Formulaire ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0">
        {/* Logo mobile uniquement */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <img src="/logo.png" alt="NexusGate" className="size-8 rounded-lg" />
          <span className="font-mono font-semibold text-title-50 text-base leading-none">
            Nexus<span className="text-primary-500">Gate</span>
          </span>
        </div>

        {/* Conteneur du formulaire — max 420px */}
        <div className="w-full max-w-105">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-white font-mono">{value}</span>
      <span className="text-xs text-white/40">{label}</span>
    </div>
  )
}
