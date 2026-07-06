// ─── SERVER INFO CARD ──────────────────────────────────────────

import { getServerStatus } from "@/helpers/server.helper";
import type { Server } from "@/types/nexusgate.type";
import StatusBadge from "./StatusBadge";
import { cn } from "@/utils/cn";
import { dateFormat } from "@/helpers";
import { LetterBox } from "@tailgrids/icons";

export function ServerInfoCard({ server }: { server: Server }) {
  const status = getServerStatus(server);
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-2">
          <h2 className="text-xs pt-4 font-semibold text-gray-400 uppercase tracking-wider">
            Details Serveur :
          </h2>
        </div>
      </div>
      <div className="bg-white border h-43.5 border-slate-200 rounded-xl p-5 flex flex-col gap-4">
        {/* Row 1 : nom + badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-900">
              #ID :{" "}
              <span className="text-sm font-mono text-gray-500">
                {server.identifier}
              </span>
            </h3>
            <MetaItem label="" value={server.url || "—"} mono />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={status} isActive />
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded",
                server.type === "CLOUD"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-orange-50 text-orange-600",
              )}
            >
              {server.type}
            </span>
            {server.requireToken && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-purple-50 text-purple-600">
                Token requis
              </span>
            )}
          </div>
        </div>

        {/* Row 2 : meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 mt-1 border-t border-slate-100">
          {/* <MetaItem label="URL cible" value={server.url || "—"} mono /> */}
          <MetaItem
            label="Créé le"
            value={dateFormat(server.createdAt, "DD MMM YYYY")}
          />
          <MetaItem
            label="Mis à jour"
            value={dateFormat(server.updatedAt, "DD MMM YYYY")}
          />
        </div>

        {/* Tunnel info si LOCAL */}
        {server.type === "LOCAL" && server.tunnelSession && (
          <div
            className={cn(
              "flex items-center gap-2 text-xs px-3 py-2 rounded-lg border",
              server.tunnelSession.isActive
                ? "border-amber-100 bg-amber-50 text-amber-700"
                : "border-gray-100 bg-gray-50 text-gray-500",
            )}
          >
            <LetterBox className="w-5 h-5" />
            {server.tunnelSession.isActive
              ? `Tunnel connecté depuis ${dateFormat(server.tunnelSession.connectedAt, "HH:mm:ss")} · dernier ping ${dateFormat(server.tunnelSession.lastPingAt, "HH:mm:ss")}`
              : `Tunnel inactif · dernière activité ${dateFormat(server.tunnelSession.lastPingAt, "HH:mm:ss")}`}
          </div>
        )}
      </div>
    </section>
  );
}

export function MetaItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={cn("text-xs text-gray-700 truncate", mono && "font-mono")}
      >
        {value}
      </span>
    </div>
  );
}
