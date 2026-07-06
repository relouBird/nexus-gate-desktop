// pages/TokensPage.tsx
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import { pause } from '@/constants'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { useGatewayTokenStore } from '@/stores/gateway-token.store'
import { useServerStore } from '@/stores/server.store'
import { useNotify } from '@/helpers/notifications.helper'
import { cn } from '@/utils/cn'
import { dateFormat } from '@/helpers'
import { Close, Copy1, Trash1 } from '@tailgrids/icons'
import type { GatewayToken, Server } from '@/types/nexusgate.type'
import type { AccessPolicy } from '@/types/nexusgate.type'
import AccessPolicyEditor from '@/components/account/AccessPolicyEditor'

// ─── MAIN PAGE ─────────────────────────────────────────────────

export default function TokensPage(): React.JSX.Element {
  const notify = useNotify()

  // Stores
  const { tokens, getManyToken, createToken, removeToken } = useStore(useGatewayTokenStore)
  const { servers, getManyServer } = useStore(useServerStore)

  // États
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(500)
        await getManyToken(notify)
        await getManyServer(notify)
      } catch (error) {
        console.log('Failed to fetch Datas:', String(error))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Handlers ─────────────────────────────────────────────

  async function handleCreateToken(name: string, scope: string[]): Promise<void> {
    setCreateLoading(true)
    try {
      await pause(400)
      await createToken({ name, scope }, notify)
      setShowCreateModal(false)
    } catch (error) {
      console.log('ERROR ===>', error)
    } finally {
      setCreateLoading(false)
    }
  }

  async function handleRemoveToken(tokenId: string): Promise<void> {
    setDeleteLoading(true)
    try {
      await pause(400)
      await removeToken({ id: tokenId }, notify)
    } catch (error) {
      console.log('ERROR ===>', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  function handleCopyToken(value: string): void {
    navigator.clipboard.writeText(value)
    notify?.({
      message: 'Token copié dans le presse-papier',
      color: 'success',
      visible: true
    })
  }

  const isAnyLoading = isLoading || createLoading || deleteLoading

  return (
    <div>
      <PageHeader
        title="Vos Tokens"
        buttonName="Générer un token"
        description="Créez et gérez vos tokens de manière efficace pour sécuriser vos accès aux ressources serveurs"
        onView={() => setShowCreateModal(true)}
      />

      <Overlay
        visible={isAnyLoading}
        text={
          createLoading
            ? 'Création du token...'
            : deleteLoading
              ? 'Révocation du token...'
              : 'Chargement des tokens...'
        }
        isDeleting={deleteLoading}
      >
        {/* Liste des tokens */}
        {tokens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-3">
            {tokens.map((token) => (
              <TokenCard
                key={token.id}
                token={token}
                servers={servers}
                onCopy={handleCopyToken}
                onRemove={handleRemoveToken}
                isLoading={deleteLoading}
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="flex flex-col items-center gap-3 py-20 text-center -mt-3">
              <p className="text-sm font-medium text-gray-600">Aucun token créé</p>
              <p className="text-xs text-gray-400">
                Générez votre premier token pour sécuriser l&apos;accès à vos serveurs.
              </p>
            </div>
          )
        )}
      </Overlay>

      {/* Modale de création */}
      {showCreateModal && (
        <CreateTokenModal
          servers={servers}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateToken}
          isLoading={createLoading}
        />
      )}
    </div>
  )
}

// ─── TOKEN CARD ────────────────────────────────────────────────

function TokenCard({
  token,
  servers,
  onCopy,
  onRemove,
  isLoading
}: {
  token: GatewayToken
  servers: Server[]
  onCopy: (value: string) => void
  onRemove: (id: string) => void
  isLoading: boolean
}): React.JSX.Element {
  const scopeServers =
    token.scope.length === servers.length
      ? 'Tous les serveurs'
      : servers
          .filter((s) => token.scope.find((u) => u.serverId == s.id))
          .map((s) => s.name)
          .join(', ') || 'Aucun serveur'

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{token.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Créé le {dateFormat(token.createdAt, 'DD MMM YYYY HH:mm')}
          </p>
        </div>
        <span
          className={cn(
            'text-xs font-medium px-2 py-1 rounded shrink-0',
            token.revoked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          )}
        >
          {token.revoked ? 'Révoqué' : 'Actif'}
        </span>
      </div>

      {/* Token Value */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center justify-between gap-2">
        <code className="text-xs font-mono text-gray-700 truncate flex-1">{token.value}</code>
        <button
          onClick={() => onCopy(token.value)}
          className="p-1 hover:bg-gray-200 rounded transition-colors shrink-0"
          title="Copier le token"
        >
          <Copy1 className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Scope */}
      <div className="text-xs text-gray-500">
        <span className="font-medium text-gray-400">Portée :</span>{' '}
        <span className="text-gray-600">{scopeServers}</span>
      </div>

      {/* Actions */}
      {!token.revoked && (
        <button
          onClick={() => onRemove(token.id)}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium
                   text-red-600 bg-red-50 hover:bg-red-100 border border-red-100
                   rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash1 className="w-3.5 h-3.5" />
          Révoquer le token
        </button>
      )}
    </div>
  )
}

// ─── CREATE TOKEN MODAL ────────────────────────────────────────

function CreateTokenModal({
  servers,
  onClose,
  onCreate,
  isLoading
}: {
  servers: Server[]
  onClose: () => void
  onCreate: (name: string, scope: string[]) => void
  isLoading: boolean
}): React.JSX.Element {
  const [name, setName] = useState('')
  const [policy, setPolicy] = useState<AccessPolicy>({
    mode: 'include',
    serverIds: []
  })

  const canSubmit = name.trim().length >= 5 && policy.serverIds.length > 0

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault()
    if (!canSubmit || isLoading) return

    // Transformer le scope : si "*" est présent, remplacer par tous les IDs
    const finalScope = policy.serverIds.includes('*') ? servers.map((s) => s.id) : policy.serverIds

    onCreate(name.trim(), finalScope)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Créer un token"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-gray-900">Générer un nouveau token</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
            aria-label="Fermer"
          >
            <Close />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 py-5 overflow-y-auto">
          {/* Nom du token */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="token-name"
              className="text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Nom du token
            </label>
            <input
              id="token-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Production API Key"
              minLength={5}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-gray-700
                       placeholder:text-gray-300 transition-colors
                       focus:outline-none focus:ring-2 focus:border-indigo-400 focus:ring-indigo-100"
              disabled={isLoading}
              autoFocus
            />
            {name.length > 0 && name.length < 5 && (
              <p className="text-xs text-red-500">Minimum 5 caractères requis ({name.length}/5)</p>
            )}
          </div>

          {/* Portée (AccessPolicy) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Portée du token
            </label>
            <AccessPolicyEditor
              policy={policy}
              servers={servers}
              onChange={setPolicy}
              isTokenProcess
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création...
              </>
            ) : (
              'Générer le token'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
