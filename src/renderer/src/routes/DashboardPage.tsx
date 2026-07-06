// pages/DashboardPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { pause } from '@/constants'
import {
  MOCK_DASHBOARD_STATS,
  MOCK_SERVERS,
  MOCK_RECENT_LOGS
} from '@/constants/display/mock.constant'

// Types
import { type DashboardStats, type Server, type RequestLog } from '@/types/nexusgate.type'

// Helpers
import { formatNumber } from '@/helpers'

// Composant Icons
import ServerIcon from '@/components/icons/ServerIcon'
import RequestIcon from '@/components/icons/RequestIcon'
import { Globe2, MenuFriesLeft1, Plus, UserMultiple4 } from '@tailgrids/icons'
import ClockIcon from '@/components/icons/ClockIcon'

// Composants Metiers
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import StatCard from '@/components/gen/StatCard'
import StatSecondaryCard from '@/components/gen/StatSecondaryCard'
import ServerPreviewCard from '@/components/network/ServerPreviewCard'
import LogRow from '@/components/network/LogRow'

// ─── Main page ────────────────────────────────────────────────

export default function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [servers, setServers] = useState<Server[]>([])
  const [logs, setLogs] = useState<RequestLog[]>([])

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(1500)
        setStats(MOCK_DASHBOARD_STATS)
        setServers(MOCK_SERVERS.slice(0, 4))
        setLogs(MOCK_RECENT_LOGS.slice(0, 8))
      } catch (error) {
        console.log('Failed to fetch data:', String(error))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const errorRate = stats
    ? Math.round((stats.requests24h.errors / stats.requests24h.total) * 100)
    : 0

  return (
    <div>
      <PageHeader
        title="Tableau de Bord"
        buttonName="Vos Serveurs"
        icon={Globe2}
        description="Bienvenue sur le tableau de bord, visualisez vos données de façon claire et concises"
        onView={() => navigate('/network/servers')}
      />

      <Overlay visible={isLoading} text="Chargement des données du dashboard...">
        {stats && (
          <div className="flex flex-col gap-6 mt-6">
            {/* ── KPI Grid ── */}
            <section aria-label="Indicateurs clés">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Vue d&apos;ensemble
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                  label="Requêtes 24h"
                  value={stats.requests24h.total}
                  sub={`${formatNumber(stats.requests24h.success)} succès · ${formatNumber(stats.requests24h.errors)} erreurs`}
                  subVariant={errorRate > 10 ? 'danger' : 'neutral'}
                  icon={<RequestIcon />}
                />
                <StatCard
                  label="Serveurs actifs"
                  value={`${stats.servers.total - 1} / ${stats.servers.total}`}
                  sub={`${stats.servers.cloud} cloud · ${stats.servers.local} local · ${stats.servers.tunnelOnline} tunnel`}
                  subVariant="neutral"
                  icon={<ServerIcon />}
                />
                <StatCard
                  label="Tokens actifs"
                  value={stats.tokens.active}
                  sub={`${stats.tokens.revoked} révoqué${stats.tokens.revoked > 1 ? 's' : ''}`}
                  subVariant={stats.tokens.revoked > 0 ? 'warning' : 'neutral'}
                  icon={
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-4 h-4"
                    >
                      <path
                        d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v5m-3-2.5h6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />
                <StatCard
                  label="Latence moy."
                  value={`${stats.requests24h.avgLatencyMs} ms`}
                  sub={`${formatNumber(stats.requests24h.blockedByRules)} req. bloquées`}
                  subVariant={stats.requests24h.avgLatencyMs > 200 ? 'danger' : 'success'}
                  icon={<ClockIcon />}
                />
              </div>
            </section>

            {/* ── Secondary stats ── */}
            <div className="grid grid-cols-3 gap-3">
              <StatSecondaryCard
                label="Règles actives"
                value={stats.rules.active}
                subValue={`/ ${stats.rules.total}`}
                icon={<MenuFriesLeft1 size={17} />}
                iconColor="bg-purple-50 text-purple-400"
              />
              <StatSecondaryCard
                label="Membres équipe"
                value={stats.members.total}
                icon={<UserMultiple4 size={17} />}
                iconColor="bg-teal-50 text-teal-400"
              />
              <StatSecondaryCard
                label="Taux d'erreur"
                value={`${errorRate}%`}
                valueColor="error"
                icon={<Plus size={20} />}
                iconColor="bg-amber-50 text-amber-400"
              />
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Aperçu serveurs (2/5) */}
              <section
                className="lg:col-span-2 flex flex-col gap-3"
                aria-label="Aperçu des serveurs"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Serveurs
                  </h2>
                  <button
                    onClick={() => navigate('/network/servers')}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {servers.map((server) => (
                    <ServerPreviewCard
                      key={server.id}
                      server={server}
                      onClick={() => navigate(`/network/servers/${server.id}`)}
                    />
                  ))}
                </div>
              </section>

              {/* Logs récents (3/5) */}
              <section className="lg:col-span-3 flex flex-col gap-3" aria-label="Logs récents">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Activité récente
                  </h2>
                  <button
                    onClick={() => navigate('/network/servers')}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Logs complets →
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {/* Header colonnes */}
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-200 bg-slate-50/60">
                    <span className="text-xs text-slate-400 w-14 shrink-0">Méthode</span>
                    <span className="text-xs text-slate-400 flex-1">Chemin</span>
                    <span className="text-xs text-slate-400 hidden sm:block max-w-30">Serveur</span>
                    <span className="text-xs text-slate-400 w-10 text-right shrink-0">Code</span>
                    <span className="text-xs text-slate-400 w-14 text-right shrink-0">Latence</span>
                    <span className="text-xs text-slate-400 w-10 text-right shrink-0">Heure</span>
                  </div>
                  {logs.map((log) => (
                    <LogRow key={log.id} log={log} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </Overlay>
    </div>
  )
}
