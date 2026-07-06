// pages/TeamSettingsPage.tsx
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import { pause } from '@/constants'
import { useEffect, useState } from 'react'
import AccessDenied from '@/components/account/AccessDenied'
import { FieldGroup, SectionCard } from '@/components/account/UtilsParam'
import { dateFormat } from '@/helpers'
import { AuthInput } from '@/components/auth/AuthFormparts'
import TeamNameForm from '@/components/account/TeamNameForm'
import DeleteTeamComponent from '@/components/account/DeleteTeamComponent'
import { TeamSlugForm } from '@/components/account/TeamSlugForm'
import { useStore } from 'zustand'
import { useMeStore } from '@/stores/me.store'
import { useAuthStore } from '@/stores/auth.store'
import { useNotify } from '@/helpers/notifications.helper'
import { useNavigate } from 'react-router'

// ─── Page principale ──────────────────────────────────────────

export default function TeamSettingsPage(): React.JSX.Element {
  // Les utilitaires
  const notify = useNotify()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const { user: me, team } = useStore(useMeStore)
  const { updateTeam } = useStore(useAuthStore)

  // Méthodes
  const updateTeamName = async (tn: string): Promise<void> => {
    const payload = { teamName: tn, slug: team?.slug ?? '' }

    try {
      await updateTeam(payload, navigate, notify)
    } catch (error) {
      console.log('Failed to update team name:', String(error))
    }
  }

  const updateSlug = async (tn: string): Promise<void> => {
    const payload = { teamName: team?.name ?? '', slug: tn }

    try {
      await updateTeam(payload, navigate, notify)
    } catch (error) {
      console.log('Failed to update slug:', String(error))
    }
  }

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(500)
      } catch (error) {
        console.log('Failed to fetch team settings:', String(error))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const isCreator = me?.role === 'CREATOR'

  return (
    <div>
      <PageHeader
        title="Paramètres de l'équipe"
        description="Gérez les informations et la configuration de votre équipe"
        disabled
      />

      <Overlay visible={isLoading} text="Chargement des paramètres...">
        {/* Guard CREATOR */}
        {me && !isCreator && <AccessDenied />}

        {me && isCreator && team && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            <div className="w-full flex flex-col gap-5">
              {/* ── Infos lecture seule ── */}
              <SectionCard
                title="Informations de l'équipe"
                description="Identifiants de votre équipe sur la plateforme"
              >
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <FieldGroup label="Identifiant (UUID)" htmlFor="team-id-ro">
                      <AuthInput id="team-id-ro" value={team.id} readOnly mono />
                    </FieldGroup>
                  </div>
                  <div className="col-span-1">
                    <FieldGroup label="Dernière mise à jour" htmlFor="team-updated-ro">
                      <AuthInput
                        id="team-updated-ro"
                        value={dateFormat(team.updatedAt, 'DD MMM YYYY')}
                        readOnly
                      />
                    </FieldGroup>
                  </div>
                </div>
              </SectionCard>

              {/* ── Changer slug ── */}
              <SectionCard
                title="Slug de l'équipe"
                description="Identifiant utilisé dans toutes vos URLs de gateway — modification avec précaution"
              >
                <TeamSlugForm team={team} onUpdate={updateSlug} />
              </SectionCard>
            </div>

            <div className="w-full flex flex-col gap-5">
              {/* ── Changer nom ── */}
              <SectionCard
                title="Nom de l'équipe"
                description="Le nom affiché dans l'interface pour tous les membres"
              >
                <TeamNameForm team={team} onUpdate={updateTeamName} />
              </SectionCard>
              {/* ── Zone de danger ── */}
              <DeleteTeamComponent teamName={team.name} />
            </div>
          </div>
        )}
      </Overlay>
    </div>
  )
}
