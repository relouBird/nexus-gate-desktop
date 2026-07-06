// pages/SettingsPage.tsx
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import { pause } from '@/constants'
import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { dateFormat } from '@/helpers'

import { AuthInput } from '@/components/auth/AuthFormparts'
import PasswordChangeForm from '@/components/account/PasswordChangeForm'
import UsernameChangeForm from '@/components/account/UsernameChangeForm'
import { useStore } from 'zustand'
import { useMeStore } from '@/stores/me.store'
import { useNotify } from '@/helpers/notifications.helper'
import { FieldGroup, SectionCard } from '@/components/account/UtilsParam'
import { roleLabel } from '@/helpers/user.helper'

// ─── Page ─────────────────────────────────────────────────────

export default function SettingsPage(): React.JSX.Element {
  const notify = useNotify()

  const [isLoading, setIsLoading] = useState(false)
  const { user, team, getMe } = useStore(useMeStore)

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(500)
        await getMe(notify)
      } catch (error) {
        console.log('Failed to fetch settings:', String(error))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <PageHeader
        title="Paramètres"
        description="Gérez les informations de votre compte"
        disabled
      />

      <Overlay visible={isLoading} text="Chargement des paramètres...">
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full flex flex-col gap-5">
              {/* ── Carte identité (lecture seule) ── */}
              <SectionCard
                title="Informations du compte"
                description="Vos informations personnelles telles qu'enregistrées sur la plateforme"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Adresse email" htmlFor="email-ro">
                    <AuthInput id="email-ro" value={user.email} readOnly />
                  </FieldGroup>
                  <FieldGroup label="Rôle" htmlFor="role-ro">
                    <div className="flex items-center h-10 px-3.5">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2.5 py-1 rounded-full',
                          roleLabel[user.role].color
                        )}
                      >
                        {roleLabel[user.role].label}
                      </span>
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Équipe" htmlFor="team-ro">
                    <AuthInput id="team-ro" value={team?.name ?? '—'} readOnly />
                  </FieldGroup>
                  <FieldGroup label="Membre depuis" htmlFor="since-ro">
                    <AuthInput id="since-ro" value={dateFormat(user.createdAt)} readOnly />
                  </FieldGroup>
                </div>
              </SectionCard>

              {/* ── Changer username ── */}
              <SectionCard
                title="Nom d'utilisateur"
                description="Modifiez votre identifiant public sur la plateforme"
              >
                <UsernameChangeForm />
              </SectionCard>
            </div>

            <div className="w-full flex flex-col  gap-5">
              {/* ── Changer mot de passe ── */}
              <SectionCard
                title="Mot de passe"
                description="Choisissez un mot de passe fort d'au moins 8 caractères"
              >
                <PasswordChangeForm />
              </SectionCard>

              {/* ── Zone de danger ── */}
              {user.role != 'CREATOR' && (
                <div className="border border-red-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-red-100 bg-red-50/50">
                    <h2 className="text-sm font-semibold text-red-700">Zone de danger</h2>
                    <p className="text-xs text-red-400 mt-0.5">Ces actions sont irréversibles</p>
                  </div>
                  <div className="px-5 py-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Supprimer mon compte</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Votre compte et toutes vos données seront définitivement supprimés.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Overlay>
    </div>
  )
}
