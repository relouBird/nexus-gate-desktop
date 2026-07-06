// pages/DetailsServerPage.tsx
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import { useNotify } from '@/helpers/notifications.helper'
import { pause } from '@/constants'
import type { Rule, Server } from '@/types/nexusgate.type'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ServerInfoCard } from '@/components/network/ServerInfoCard'
import RuleModal from '@/components/network/RuleModal'
import RuleTable from '@/components/network/RuleTable'
import { Gear1 } from '@tailgrids/icons'
import { useStore } from 'zustand'
import { useUserStore } from '@/stores/user.store'
import { useRuleStore } from '@/stores/rule.store'
import { useServerStore } from '@/stores/server.store'
import ServerProcessModal, { type ServerProcessData } from '@/components/network/ServerProcessModal'

// Ajouter après les imports existants
import RevokeConfirmModal from '@/components/network/RevokeConfirmModal'
import GrantUsersModal from '@/components/network/GrantUsersModal'
import TokenAuthConfirmModal from '@/components/network/TokenAuthConfirmModal'
import ServerFastAction from '@/components/network/ServerFastAction'
import HeadersEditor from '@/components/network/HeadersEditor'

// ─── MAIN PAGE ─────────────────────────────────────────────────

export default function DetailsServerPage(): React.JSX.Element {
  const { id } = useParams()

  const notify = useNotify()
  const navigate = useNavigate()

  // Stores
  const { users, getManyUser } = useStore(useUserStore)
  const {
    server,
    getServer,
    updateServer,
    revokeServer,
    deleteServer,
    tokenAuthServer,
    setServerHeader,
    grantServer
  } = useStore(useServerStore)
  const { rules, getManyRule, createRule, updateRule, deleteRule } = useStore(useRuleStore)

  // Les differents loading
  const [isLoading, setIsLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [headers, setHeaders] = useState<Record<string, string>>(server ? server.headers : {})
  const [showRuleModal, setShowRuleModal] = useState(false)

  // Création server
  const [showUpdate, setShowUpdate] = useState(false)

  // Affichage des modals
  // Ajouter après les autres useState
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [showTokenAuthModal, setShowTokenAuthModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(500)
        // Trouve le server par id (uuid) ou par index selon ton routing
        console.log('GET ONE SERVER CALLED')
        await getServer(String(id), notify)
        await getManyRule(String(id), notify)
      } catch (error) {
        console.log('Failed to fetch server:', String(error))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // ─── Mettre à jour un Serveur ───────────────────────────────
  const handleupdated = useCallback(
    async (u: ServerProcessData) => {
      try {
        console.log('DATA ====>', u.name)
        await updateServer({ id: id ?? '', ...u }, notify)
      } catch (error) {
        console.log('Votre Erreur est : ', error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // ─── Ajouter  une règle ───────────────────────────────────
  async function handleAddRule(rule: Rule): Promise<void> {
    const { id, createdAt, updatedAt, ...data } = rule

    try {
      console.log('RULE DATA ====>', data)

      setCreateLoading(true)

      await pause(400)
      await createRule(data, notify)
    } catch (error) {
      console.log('ERROR ===>', error)
    } finally {
      setCreateLoading(false)
    }
    console.log(`TO-IGNORE ====> ${createdAt}, ${updatedAt}, ${id}`)
  }

  // ─── Mettre à jour une règle ───────────────────────────────
  async function handleToggleRule(ruleId: string): Promise<void> {
    console.log('RULE ID ====>', ruleId)
    const toUpdateRule = rules.find((r) => r.id == ruleId) as Rule

    try {
      setUpdateLoading(true)

      await pause(400)
      await updateRule(
        {
          id: ruleId,
          isActive: !toUpdateRule.isActive
        },
        notify
      )
    } catch (error) {
      console.log('ERROR ===>', error)
    } finally {
      setUpdateLoading(false)
    }
  }

  // ─── Supprimer une règle ───────────────────────────────────
  async function handleDeleteRule(ruleId: string): Promise<void> {
    console.log('RULE ID ====>', ruleId)

    try {
      setDeleteLoading(true)

      await pause(800)
      await deleteRule(ruleId, notify)
    } catch (error) {
      console.log('ERROR ===>', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── Gérer le process Revoke ───────────────────────────────
  async function handleRevoke(): Promise<void> {
    await revokeServer({ id: server?.id ?? '' }, notify)
  }

  // ─── Gérer le process de  Grant ────────────────────────────
  async function handleGrant(userIds: string[]): Promise<void> {
    await grantServer({ id: server?.id ?? '', userIds }, notify)
  }

  // ─── Gérer Token Auth ──────────────────────────────────────
  async function handleTokenAuth(newValue: boolean): Promise<void> {
    await tokenAuthServer({ id: server?.id ?? '', requireToken: newValue }, notify)
  }

  // ─── Gérer Headers Server ───────────────────────────────────
  async function handleServerHeader(): Promise<void> {
    await pause(500)
    await setServerHeader({ id: server?.id ?? '', headers }, notify)
  }

  // ─── Handlers Delete Server ───────────────────────────────
  async function handleDeleteServer(): Promise<void> {
    try {
      await deleteServer(server?.id ?? '', notify)
      // Rediriger après suppression
      navigate('/network/servers')
    } catch (error) {
      console.log('ERROR ===>', error)
    }
  }

  return (
    <div>
      <PageHeader
        title={server ? `Serveur : ${server.name}` : `Serveur : ${id}`}
        description="Surveillez votre serveur et gérez ses règles de sécurité"
        buttonName="Mis à jour Serveur"
        icon={Gear1}
        onView={() => setShowUpdate(true)}
      />

      <Overlay
        visible={deleteLoading || updateLoading || createLoading || isLoading}
        text={
          createLoading
            ? "Creation d'une règle"
            : updateLoading
              ? 'Mis à jour de la règle'
              : deleteLoading
                ? "Suppression d'une règle"
                : `Chargement du serveur ${id}…`
        }
        isDeleting={deleteLoading}
      >
        {server && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 -mt-3">
              {/* Infos server */}
              <section className="lg:col-span-4">
                <ServerInfoCard server={server} />
              </section>

              {/* Règles */}
              <section className="lg:col-span-5">
                <RuleTable
                  rules={rules}
                  onToggle={handleToggleRule}
                  onDelete={handleDeleteRule}
                  onAdd={() => setShowRuleModal(true)}
                />
              </section>

              <section className="lg:col-span-3 pt-4">
                {/* Actions rapides */}
                <ServerFastAction
                  server={server}
                  setTokenAuth={() => setShowTokenAuthModal(true)}
                  setRevoke={() => setShowRevokeModal(true)}
                  setGrantUsers={() => {
                    getManyUser()
                    setShowGrantModal(true)
                  }}
                  setDeleteUser={() => setShowDeleteModal(true)}
                />
              </section>

              {/* Logs */}
              <section className="lg:col-span-6">
                <HeadersEditor
                  headers={headers}
                  onChange={setHeaders}
                  onValid={handleServerHeader}
                  disabled={false}
                />
              </section>
            </div>
          </>
        )}

        {!server && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm font-medium text-gray-600">Serveur introuvable</p>
            <p className="text-xs text-gray-400">
              L&apos;identifiant <code className="font-mono bg-gray-100 px-1 rounded">{id}</code> ne
              correspond à aucun serveur.
            </p>
          </div>
        )}
      </Overlay>

      {/* Modale règle */}
      {showRuleModal && server && (
        <RuleModal
          serverId={server.id}
          onClose={() => setShowRuleModal(false)}
          onSave={handleAddRule}
        />
      )}

      {/* Modales */}
      {showUpdate && (
        <ServerProcessModal
          server={server as Server}
          onClose={() => setShowUpdate(false)}
          onProcess={handleupdated}
        />
      )}

      {/* Modale Token Auth */}
      {showTokenAuthModal && server && (
        <TokenAuthConfirmModal
          serverName={server.name}
          currentValue={server.requireToken}
          onClose={() => setShowTokenAuthModal(false)}
          onConfirmed={handleTokenAuth}
        />
      )}

      {/* Modale Grant Users */}
      {showGrantModal && server && (
        <GrantUsersModal
          server={server}
          users={users}
          currentUserIds={[]}
          onClose={() => setShowGrantModal(false)}
          onConfirmed={handleGrant}
        />
      )}

      {/* Modale Revoke */}
      {showRevokeModal && server && (
        <RevokeConfirmModal
          message="Retrait des droits aux utilisateurs"
          server={server}
          onClose={() => setShowRevokeModal(false)}
          onConfirmed={handleRevoke}
        />
      )}

      {/* Modale Delete Server - Réutilise RevokeConfirmModal */}
      {showDeleteModal && server && (
        <RevokeConfirmModal
          server={server}
          onClose={() => setShowDeleteModal(false)}
          onConfirmed={handleDeleteServer}
        />
      )}
    </div>
  )
}
