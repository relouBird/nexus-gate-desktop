// components/display/LogsTable.tsx
// Composant pur : reçoit des logs déjà filtrés, rien d'autre.
// Le filtrage, la pagination et les requêtes sont dans la page.
//
// Exports :
//   LogsTable       — tableau compact
//   LogDetailDrawer — drawer détail (instancié dans la page)

import { cn } from "@/utils/cn";
import { dateFormat } from "@/helpers";
import { getMethodColor, getStatusCodeColor } from "@/helpers/server.helper";
import { Eye, Close } from "@tailgrids/icons";
import type { RequestLog } from "@/types/nexusgate.type";

// ─── LogsTable ────────────────────────────────────────────────

interface LogsTableProps {
  logs:       RequestLog[];
  /** Callback appelé quand l'utilisateur clique sur une ligne */
  onRowClick?: (log: RequestLog) => void;
}

export function LogsTable({ logs, onRowClick }: LogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white border border-base-200 rounded-xl py-14 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-foreground-soft-500">Aucun log correspondant</p>
        <p className="text-xs text-foreground-soft-500/50">
          Modifiez vos filtres ou élargissez la plage de dates
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-base-200 rounded-xl overflow-hidden">
      {/* Thead */}
      <div className="grid grid-cols-[76px_130px_1fr_108px_68px_64px_68px_68px_36px] gap-2 px-4 py-2.5 border-b border-base-200 bg-background-soft-50/60">
        {["Heure", "Serveur", "Endpoint", "IP client", "Méth.", "Code", "Latence", "Origine", ""].map((h) => (
          <span key={h} className="text-[10px] font-semibold text-foreground-soft-500/60 uppercase tracking-wider">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto divide-y divide-base-100">
        {logs.map((log) => (
          <LogRow key={log.id} log={log} onRowClick={onRowClick} />
        ))}
      </div>
    </div>
  );
}

// ─── LogRow ───────────────────────────────────────────────────

function LogRow({ log, onRowClick }: { log: RequestLog; onRowClick?: (log: RequestLog) => void }) {
  const isError = log.statusCode >= 500;
  const isWarn  = log.statusCode >= 400 && log.statusCode < 500;
  const isSlowMs = log.latencyMs > 500;

  return (
    <div
      onClick={() => onRowClick?.(log)}
      className={cn(
        "grid grid-cols-[76px_130px_1fr_108px_68px_64px_68px_68px_36px] gap-2 items-center px-4 py-2.5",
        "transition-colors cursor-pointer",
        isError
          ? "bg-error-50/20 hover:bg-error-50/40"
          : isWarn
          ? "hover:bg-warning-50/20"
          : "hover:bg-background-soft-50",
      )}
    >
      {/* Heure */}
      <span className="text-[10px] text-foreground-soft-500 font-mono tabular-nums">
        {dateFormat(log.timestamp, "HH:mm:ss")}
      </span>

      {/* Serveur */}
      <span className="text-[10px] font-semibold text-foreground-soft-500 bg-background-soft-100 px-2 py-0.5 rounded truncate">
        {log.serverName}
      </span>

      {/* Endpoint */}
      <span className="text-xs text-title-50 font-mono truncate">{log.path}</span>

      {/* IP */}
      <span className="text-[10px] text-foreground-soft-500 font-mono truncate">{log.clientIp}</span>

      {/* Méthode */}
      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded text-center font-mono", getMethodColor(log.method))}>
        {log.method}
      </span>

      {/* Code */}
      <span className={cn("text-xs font-semibold tabular-nums text-center", getStatusCodeColor(log.statusCode))}>
        {log.statusCode}
      </span>

      {/* Latence */}
      <span className={cn(
        "text-[10px] tabular-nums text-right font-mono",
        isSlowMs ? "text-warning-600 font-semibold" : "text-foreground-soft-500",
      )}>
        {log.latencyMs}ms
      </span>

      {/* Via */}
      <span className={cn(
        "text-[10px] font-medium px-1.5 py-0.5 rounded text-center",
        log.via === "tunnel" ? "bg-warning-50 text-warning-700" : "bg-primary-50 text-primary-600",
      )}>
        {log.via}
      </span>

      {/* Bouton détail */}
      <button
        aria-label="Voir les détails"
        onClick={(e) => { e.stopPropagation(); onRowClick?.(log); }}
        className="flex items-center justify-center text-foreground-soft-500/40 hover:text-primary-500 transition-colors"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── LogDetailDrawer ──────────────────────────────────────────
// Exporté séparément — instancié dans la page, pas dans LogsTable

interface LogDetailDrawerProps {
  log:     RequestLog;
  onClose: () => void;
}

export function LogDetailDrawer({ log, onClose }: LogDetailDrawerProps) {
  const isSuccess = log.statusCode < 300;
  const isError   = log.statusCode >= 500;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background-50 shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-base-200"
        role="complementary"
        aria-label="Détails du log"
      >
        {/* Header sticky */}
        <div className="sticky top-0 bg-background-50 border-b border-base-200 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Status indicator */}
            <span className={cn(
              "w-2 h-2 rounded-full shrink-0",
              isSuccess ? "bg-success-400" : isError ? "bg-error-500" : "bg-warning-400",
            )} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-title-50 truncate">{log.path}</p>
              <p className="text-[10px] text-foreground-soft-500/60 font-mono truncate">{log.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-soft-500 hover:text-title-50 hover:bg-background-soft-100 transition-colors shrink-0 ml-2"
            aria-label="Fermer"
          >
            <Close className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5">

          {/* Résumé visuel */}
          <div className="grid grid-cols-3 gap-2">
            <SummaryChip
              label="Status"
              value={String(log.statusCode)}
              variant={isSuccess ? "success" : isError ? "error" : "warning"}
            />
            <SummaryChip
              label="Méthode"
              value={log.method}
              variant="neutral"
            />
            <SummaryChip
              label="Latence"
              value={`${log.latencyMs}ms`}
              variant={log.latencyMs > 500 ? "warning" : "success"}
            />
          </div>

          {/* Section requête */}
          <DrawerSection title="Requête">
            <DrawerRow label="Heure"    value={dateFormat(log.timestamp, "DD/MM/YYYY HH:mm:ss")} />
            <DrawerRow label="Serveur"  value={log.serverName} />
            <DrawerRow label="Endpoint" value={log.path} mono />
            <DrawerRow label="IP"       value={log.clientIp} mono />
            <DrawerRow label="Origine"  value={log.via} badge />
          </DrawerSection>

          {/* Section réponse */}
          <DrawerSection title="Réponse">
            <DrawerRow label="Code HTTP" value={String(log.statusCode)} badge />
            <DrawerRow label="Latence"   value={`${log.latencyMs} ms`} />
          </DrawerSection>

          {/* Token (si présent) */}
          {log.gatewayTokenId && (
            <DrawerSection title="Authentification">
              <DrawerRow label="Gateway Token" value={log.gatewayTokenId} mono />
            </DrawerSection>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── Sub-composants drawer ────────────────────────────────────

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-[10px] font-semibold text-foreground-soft-500/60 uppercase tracking-wider px-1">
        {title}
      </h4>
      <div className="bg-white border border-base-200 rounded-xl divide-y divide-base-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function DrawerRow({ label, value, mono = false, badge = false }: {
  label: string; value: string; mono?: boolean; badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 gap-4">
      <span className="text-xs text-foreground-soft-500 shrink-0">{label}</span>
      {badge ? (
        <span className={cn(
          "text-[10px] font-semibold px-2 py-0.5 rounded",
          value === "GET"    && "bg-primary-50 text-primary-600",
          value === "POST"   && "bg-success-50 text-success-700",
          value === "PUT"    && "bg-warning-50 text-warning-700",
          value === "PATCH"  && "bg-warning-50 text-warning-700",
          value === "DELETE" && "bg-error-50 text-error-600",
          value.startsWith("2") && "bg-success-50 text-success-700",
          value.startsWith("4") && "bg-warning-50 text-warning-700",
          value.startsWith("5") && "bg-error-50 text-error-600",
          value === "cloud"  && "bg-primary-50 text-primary-600",
          value === "tunnel" && "bg-warning-50 text-warning-700",
        )}>
          {value}
        </span>
      ) : (
        <span className={cn(
          "text-xs text-title-50 text-right truncate max-w-[60%]",
          mono && "font-mono text-foreground-soft-500",
        )}>
          {value}
        </span>
      )}
    </div>
  );
}

function SummaryChip({ label, value, variant }: {
  label: string;
  value: string;
  variant: "success" | "error" | "warning" | "neutral";
}) {
  const colors = {
    success: "bg-success-50 border-success-100 text-success-700",
    error:   "bg-error-50 border-error-100 text-error-600",
    warning: "bg-warning-50 border-warning-100 text-warning-700",
    neutral: "bg-background-soft-50 border-base-200 text-foreground-soft-500",
  }[variant];

  return (
    <div className={cn("flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border", colors)}>
      <span className="text-[10px] font-medium opacity-70">{label}</span>
      <span className="text-sm font-semibold font-mono">{value}</span>
    </div>
  );
}