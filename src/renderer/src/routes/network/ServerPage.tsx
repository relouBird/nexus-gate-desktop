// pages/ServersPage.tsx
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/gen/PageHeader'
import { Overlay } from '@/components/display/Overlay'
import { pause } from '@/constants'
import { ServerStatusTypes, type Server } from '@/types/nexusgate.type'
import { getServerStatus } from '@/helpers/server.helper'

// Les composants Icones
import ServerIcon from '@/components/icons/ServerIcon'
import { Globe2 } from '@tailgrids/icons'
import EmptyState from '@/components/gen/EmptyState'
import ServerCard from '@/components/network/ServerCard'
import ServerProcessModal, { type ServerProcessData } from '@/components/network/ServerProcessModal'
import { useMeStore } from '@/stores/me.store'
import { useStore } from 'zustand'
import { useServerStore } from '@/stores/server.store'
import { useNotify } from '@/helpers/notifications.helper'

// ─── Filter bar ───────────────────────────────────────────────

type FilterType = 'all' | 'CLOUD' | 'LOCAL'
type FilterStatus = 'all' | 'online' | 'offline'

function FilterBar({
  typeFilter,
  statusFilter,
  search,
  onType,
  onStatus,
  onSearch
}: {
  typeFilter: FilterType
  statusFilter: FilterStatus
  search: string
  onType: (v: FilterType) => void
  onStatus: (v: FilterStatus) => void
  onSearch: (v: string) => void
}): React.JSX.Element {
  const typeOpts: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'CLOUD', label: 'Cloud' },
    { value: 'LOCAL', label: 'Local' }
  ]
  const statusOpts: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'Tous statuts' },
    { value: 'online', label: 'En ligne' },
    { value: 'offline', label: 'Hors ligne' }
  ]

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
        >
          <circle cx="6.5" cy="6.5" r="4" />
          <path d="M10 10l3 3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Rechercher un serveur..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition"
        />
      </div>

      {/* Type pills */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
        {typeOpts.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onType(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              typeFilter === opt.value
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Status select */}
      <select
        aria-label="Filtrer par statut"
        value={statusFilter}
        onChange={(e) => onStatus(e.target.value as FilterStatus)}
        className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:border-indigo-300 transition"
      >
        {statusOpts.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── Stats summary bar ────────────────────────────────────────

function SummaryBar({ servers }: { servers: Server[] }): React.JSX.Element {
  const online = servers.filter((s) => getServerStatus(s) === ServerStatusTypes.ONLINE).length
  const tunnel = servers.filter((s) => getServerStatus(s) === ServerStatusTypes.TUNNEL).length
  const offline = servers.filter((s) => getServerStatus(s) === ServerStatusTypes.OFFLINE).length

  return (
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <span>
        <span className="font-semibold text-gray-700">{servers.length}</span> serveur
        {servers.length !== 1 ? 's' : ''}
      </span>
      <span className="w-px h-3 bg-gray-200" />
      {online > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {online} en ligne
        </span>
      )}
      {tunnel > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {tunnel} tunnel
        </span>
      )}
      {offline > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          {offline} hors ligne
        </span>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────

export default function ServerPage(): React.JSX.Element {
  const notify = useNotify()

  // Stores
  const { servers, getManyServer, setServer, createServer } = useStore(useServerStore)
  const { user: me } = useStore(useMeStore)

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')

  const canCreate = me?.role === 'CREATOR' || me?.role === 'ADMIN'

  // Création server
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(500)
        console.log('GET MANY SERVER CALLED')
        await getManyServer(notify)
      } catch (error) {
        console.log('Failed to fetch servers:', String(error))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = servers.filter((s) => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (statusFilter !== 'all') {
      const status = getServerStatus(s)
      if (statusFilter === 'online' && status === ServerStatusTypes.OFFLINE) return false
      if (statusFilter === 'offline' && status !== ServerStatusTypes.OFFLINE) return false
    }
    if (
      search &&
      !s.name.toLowerCase().includes(search.toLowerCase()) &&
      !s.identifier.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const handleCreated = useCallback(
    async (u: ServerProcessData) => {
      try {
        console.log('DATA ====>', u.name)
        await createServer(u, notify)
      } catch (error) {
        console.log('Votre Erreur est : ', error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const hasFilters = typeFilter !== 'all' || statusFilter !== 'all' || search !== ''

  return (
    <div>
      <PageHeader
        title="Serveurs"
        buttonName="Nouveau serveur"
        icon={Globe2}
        disabled={!canCreate}
        description="Gérez les APIs enregistrées et surveillez leur statut en temps réel"
        onView={() => setShowCreate(true)}
      />

      <Overlay visible={isLoading} text="Chargement des serveurs...">
        <div className="flex flex-col gap-4 mt-6">
          {/* Filter bar */}
          <FilterBar
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            search={search}
            onType={setTypeFilter}
            onStatus={setStatusFilter}
            onSearch={setSearch}
          />

          {/* Summary */}
          {filtered.length > 0 && <SummaryBar servers={filtered} />}

          {/* Grid */}
          {filtered.length === 0 ? (
            <EmptyState
              message={hasFilters ? 'Aucun serveur ne correspond' : 'Aucun serveur configuré'}
              icon={<ServerIcon className="w-7 h-7" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  onClick={() => {
                    setServer(null)
                    navigate(`/network/servers/${server.id}`)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Overlay>

      {/* Modales */}
      {showCreate && (
        <ServerProcessModal onClose={() => setShowCreate(false)} onProcess={handleCreated} />
      )}
    </div>
  )
}
