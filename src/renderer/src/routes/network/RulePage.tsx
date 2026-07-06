// pages/RulePage.tsx
import AccessDenied from '@/components/account/AccessDenied'
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import { pause } from '@/constants'
import { useMeStore } from '@/stores/me.store'
import { useEffect, useState, useMemo } from 'react'
import { useStore } from 'zustand'
import { useRuleStore } from '@/stores/rule.store'
import { useServerStore } from '@/stores/server.store'
import { useNotify } from '@/helpers/notifications.helper'
import type { Rule, Server } from '@/types/nexusgate.type'
import { RULE_TYPE_LABELS, ruleConditionSummary, ACTION_COLORS } from '@/helpers/rule.helper'
import { cn } from '@/utils/cn'
import { Trash1 } from '@tailgrids/icons'
import { ShieldRuleIcon } from '@/components/icons/ShieldRuleIcon'

// ─── MAIN PAGE ─────────────────────────────────────────────────

export default function RulePage(): React.JSX.Element {
  const notify = useNotify()
  const { user: me } = useStore(useMeStore)
  const canCreate = me?.role === 'CREATOR' || me?.role === 'ADMIN'

  // Stores
  const { allRules, getAllRules, updateRule, deleteRule } = useStore(useRuleStore)
  const { servers, getManyServer } = useStore(useServerStore)

  // États
  const [isLoading, setIsLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(500)
        await getAllRules(notify)
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

  async function handleToggleRule(ruleId: string): Promise<void> {
    const rule = allRules.find((r) => r.id === ruleId)
    if (!rule) return

    try {
      setUpdateLoading(true)
      await pause(400)
      await updateRule(
        {
          id: ruleId,
          isActive: !rule.isActive
        },
        notify
      )
    } catch (error) {
      console.log('ERROR ===>', error)
    } finally {
      setUpdateLoading(false)
    }
  }

  async function handleDeleteRule(ruleId: string): Promise<void> {
    try {
      setDeleteLoading(true)
      await pause(600)
      await deleteRule(ruleId, notify)
    } catch (error) {
      console.log('ERROR ===>', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── Regroupement par serveur ──────────────────────────────

  const serverMap = useMemo(() => {
    const map = new Map<string, Server>()
    servers.forEach((s) => map.set(s.id, s))
    return map
  }, [servers])

  const rulesByServer = useMemo(() => {
    const grouped = new Map<string, Rule[]>()

    allRules.forEach((rule) => {
      const serverRules = grouped.get(rule.serverId) || []
      serverRules.push(rule)
      grouped.set(rule.serverId, serverRules)
    })

    // Trier par nom de serveur
    return Array.from(grouped.entries()).sort((a, b) => {
      const serverA = serverMap.get(a[0])?.name || ''
      const serverB = serverMap.get(b[0])?.name || ''
      return serverA.localeCompare(serverB)
    })
  }, [allRules, serverMap])

  const isAnyLoading = isLoading || updateLoading || deleteLoading

  if (!canCreate) {
    return (
      <div>
        <PageHeader
          title="Filtres et Règles"
          description="Gérez vos filtres et règles sur les serveurs pour assurer la sécurité et la conformité des ressources"
          disabled
        />
        <AccessDenied allowedRoles={['CREATOR', 'ADMIN']} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Filtres et Règles"
        buttonName="Créer un Filtre ou une Règle"
        description="Gérez vos filtres et règles sur les serveurs pour assurer la sécurité et la conformité des ressources"
        disabled
      />

      <Overlay
        visible={isAnyLoading}
        text={
          updateLoading
            ? 'Mise à jour de la règle...'
            : deleteLoading
              ? 'Suppression de la règle...'
              : 'Chargement des filtres et règles...'
        }
        isDeleting={deleteLoading}
      >
        {/* Liste groupée par serveur */}
        {rulesByServer.length > 0 ? (
          <div className="flex flex-col gap-6 -mt-3">
            {rulesByServer.map(([serverId, rules]) => {
              const server = serverMap.get(serverId)
              return (
                <ServerRuleGroup
                  key={serverId}
                  server={server}
                  rules={rules}
                  onToggle={handleToggleRule}
                  onDelete={handleDeleteRule}
                />
              )
            })}
          </div>
        ) : (
          !isLoading && (
            <div className="flex flex-col items-center gap-3 py-20 text-center -mt-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <ShieldRuleIcon className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-600">Aucune règle configurée</p>
              <p className="text-xs text-gray-400">
                Créez des règles depuis la page d&apos;un serveur pour les voir apparaître ici.
              </p>
            </div>
          )
        )}
      </Overlay>
    </div>
  )
}

// ─── SERVER RULE GROUP ─────────────────────────────────────────

function ServerRuleGroup({
  server,
  rules,
  onToggle,
  onDelete
}: {
  server?: Server
  rules: Rule[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}): React.JSX.Element {
  return (
    <section className="flex flex-col gap-3">
      {/* Header du groupe */}
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Serveur :</h2>
        <div className="flex items-center gap-2">
          {server ? (
            <>
              <span className="text-sm font-semibold text-gray-900">{server.name}</span>
              <span className="text-xs font-mono text-gray-400">{server.identifier}</span>
              <span
                className={cn(
                  'text-[10px] font-medium px-2 py-0.5 rounded',
                  server.type === 'CLOUD'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-orange-50 text-orange-600'
                )}
              >
                {server.type}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400 font-mono">Serveur inconnu</span>
          )}
        </div>
        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-slate-200 text-gray-500 ml-auto">
          {rules.length} règle{rules.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Tableau des règles */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Thead */}
        <div className="grid grid-cols-[1fr_1.4fr_80px_80px_60px_80px] gap-3 px-4 py-2.5 border-b border-slate-200 bg-gray-50/60">
          {['Type', 'Condition', 'Action', 'Priorité', 'Actif', ''].map((header) => (
            <span
              key={header}
              className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
            >
              {header}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="max-h-64 overflow-y-auto">
          {[...rules]
            .sort((a, b) => b.priority - a.priority)
            .map((rule) => (
              <div
                key={rule.id}
                className={cn(
                  'grid grid-cols-[1fr_1.4fr_80px_80px_60px_80px] gap-3 items-center px-4 py-3 border-b border-gray-50 last:border-0 transition-colors',
                  !rule.isActive && 'opacity-50'
                )}
              >
                {/* Type */}
                <span className="text-xs font-medium text-gray-700 truncate">
                  {RULE_TYPE_LABELS[rule.type] ?? rule.type}
                </span>

                {/* Condition */}
                <span className="text-xs text-gray-500 font-mono truncate">
                  {ruleConditionSummary(rule)}
                </span>

                {/* Action */}
                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded text-center',
                    ACTION_COLORS[rule.action]
                  )}
                >
                  {rule.action}
                </span>

                {/* Priorité */}
                <span className="text-xs text-gray-400 text-center">{rule.priority}</span>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => onToggle(rule.id)}
                  aria-label={rule.isActive ? 'Désactiver la règle' : 'Activer la règle'}
                  className={cn(
                    'relative w-8 rounded-full transition-colors duration-200 focus:outline-none',
                    rule.isActive ? 'bg-indigo-500' : 'bg-gray-400'
                  )}
                  style={{ height: '18px' }}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200',
                      rule.isActive ? 'right-0.5' : 'left-0.5'
                    )}
                  />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDelete(rule.id)}
                  aria-label="Supprimer la règle"
                  className="w-6 h-6 rounded flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash1 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
