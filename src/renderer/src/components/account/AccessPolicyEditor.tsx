// ─── AccessPolicy Editor ──────────────────────────────────────

import type { AccessPolicy, Server } from '@/types/nexusgate.type'
import { cn } from '@/utils/cn'

export default function AccessPolicyEditor({
  policy,
  servers,
  onChange,
  isTokenProcess
}: {
  policy: AccessPolicy
  servers: Server[]
  isTokenProcess?: boolean
  onChange: (p: AccessPolicy) => void
}): React.JSX.Element {
  const allSelected = policy.serverIds.includes('*')

  function toggleMode(mode: 'include' | 'exclude'): void {
    onChange({ ...policy, mode, serverIds: ['*'] })
  }

  function toggleAll(): void {
    if (allSelected) {
      onChange({ ...policy, serverIds: [] })
    } else {
      onChange({ ...policy, serverIds: ['*'] })
    }
  }

  function toggleServer(id: string): void {
    if (allSelected) {
      // Dé-sélectionne "tout" → sélectionne tous sauf celui-là
      const rest = servers.map((s) => s.id).filter((sid) => sid !== id)
      onChange({ ...policy, serverIds: rest })
      return
    }
    const has = policy.serverIds.includes(id)
    const next = has ? policy.serverIds.filter((sid) => sid !== id) : [...policy.serverIds, id]
    // Si tous sont sélectionnés manuellement → utilise "*"
    const nextFinal = next.length === servers.length ? ['*'] : next
    onChange({ ...policy, serverIds: nextFinal })
  }

  function isServerSelected(id: string): boolean {
    return allSelected || policy.serverIds.includes(id)
  }

  const modeDescriptions = {
    include: "L'utilisateur accède uniquement aux serveurs cochés",
    exclude: "L'utilisateur accède à tous les serveurs sauf ceux cochés"
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toggle mode */}
      {!isTokenProcess && (
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {(['include', 'exclude'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMode(m)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                  policy.mode === m
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {m === 'include' ? 'Inclure' : 'Exclure'}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">{modeDescriptions[policy.mode]}</p>
        </div>
      )}

      {/* Liste serveurs */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {/* Toggle tout */}
        <label className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-200 accent-indigo-500"
          />
          <span className="text-xs font-semibold text-gray-600">
            {policy.mode === 'include' ? 'Tous les serveurs' : 'Aucun serveur (exclure tout)'}
          </span>
          <span className="ml-auto text-[10px] font-mono text-gray-400">*</span>
        </label>

        {/* Serveurs individuels */}
        {servers.map((server) => (
          <label
            key={server.id}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={isServerSelected(server.id)}
              onChange={() => toggleServer(server.id)}
              className="w-4 h-4 rounded border-gray-300 accent-indigo-500 focus:ring-indigo-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{server.name}</p>
              <p className="text-[10px] text-gray-400 font-mono truncate">{server.identifier}</p>
            </div>
            <span
              className={cn(
                'text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0',
                server.type === 'CLOUD'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-orange-50 text-orange-600'
              )}
            >
              {server.type}
            </span>
          </label>
        ))}
      </div>

      {/* Résumé */}
      <p className="text-[10px] text-gray-400 font-mono">
        {policy.mode === 'include'
          ? allSelected
            ? 'accessPolicy: { mode: "include", serverIds: ["*"] }'
            : `accessPolicy: { mode: "include", serverIds: [${policy.serverIds.map((id) => `"${id}"`).join(', ')}] }`
          : allSelected
            ? 'accessPolicy: { mode: "exclude", serverIds: ["*"] }'
            : `accessPolicy: { mode: "exclude", serverIds: [${policy.serverIds.map((id) => `"${id}"`).join(', ')}] }`}
      </p>
    </div>
  )
}
