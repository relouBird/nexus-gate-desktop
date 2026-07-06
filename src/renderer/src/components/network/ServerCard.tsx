// ─── Server card ──────────────────────────────────────────────

import { timeSince, dateFormat } from "@/helpers";
import { getServerStatus } from "@/helpers/server.helper";
import { ServerStatusTypes, type Server, type ServerType } from "@/types/nexusgate.type";
import { ChevronRight } from "@tailgrids/icons";
import ServerIcon from "../icons/ServerIcon";
import StatusBadge from "./StatusBadge";

function TypeBadge({ type }: { type: ServerType }) {
  const config =
    type === "CLOUD"
      ? { bg: "bg-blue-50", text: "text-blue-600", label: "Cloud" }
      : { bg: "bg-orange-50", text: "text-orange-600", label: "Local" };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

export default function ServerCard({
  server,
  onClick,
}: {
  server: Server;
  onClick: () => void;
}) {
  const status = getServerStatus(server);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all group flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              status === ServerStatusTypes.OFFLINE
                ? "bg-gray-100 text-gray-400"
                : status === ServerStatusTypes.TUNNEL
                  ? "bg-amber-50 text-amber-500 group-hover:bg-amber-100"
                  : "bg-indigo-50 text-indigo-400 group-hover:text-indigo-600 group-hover:bg-indigo-100"
            }`}
          >
            <ServerIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-700 transition-colors">
              {server.name}
            </p>
            <p className="text-xs text-gray-400 font-mono truncate">
              {server.identifier}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0 mt-0.5" />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={status} isActive />
        <TypeBadge type={server.type} />
        {server.requireToken && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-600">
            Token requis
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>
            <span className="font-medium text-gray-600">
              {server.rulesCount}
            </span>{" "}
            règle{server.rulesCount !== 1 ? "s" : ""}
          </span>
          {server.type === "LOCAL" && server.tunnelSession && (
            <span>
              Ping{" "}
              <span className="font-medium text-gray-600">
                {timeSince(server.tunnelSession.lastPingAt)}
              </span>
            </span>
          )}
          {server.type === "CLOUD" && server.url && (
            <span className="truncate max-w-35 font-mono text-gray-300">
              {server.url.replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-300">
          {dateFormat(server.updatedAt, "DD/MM/YYYY")}
        </span>
      </div>
    </button>
  );
}
