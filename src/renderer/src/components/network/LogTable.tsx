// ─── LOGS TABLE ────────────────────────────────────────────────

import { dateFormat } from "@/helpers";
import { getMethodColor, getStatusCodeColor } from "@/helpers/server.helper";
import type { RequestLog } from "@/types/nexusgate.type";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function LogTable({ logs }: { logs: RequestLog[] }) {
  const [filterMethod, setFilterMethod] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const methods = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];
  const statuses = ["ALL", "2xx", "3xx", "4xx", "5xx"];

  const filtered = logs.filter((l) => {
    if (filterMethod !== "ALL" && l.method !== filterMethod) return false;
    if (filterStatus !== "ALL") {
      const prefix = parseInt(filterStatus[0]);
      if (Math.floor(l.statusCode / 100) !== prefix) return false;
    }
    return true;
  });

  return (
    <section className="flex flex-col gap-3 mt-0 pt-0 mb-0 pb-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Logs de requêtes
          </h2>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-slate-200 text-gray-500">
            {filtered.length}
          </span>
          {/* Future SSE indicator placeholder */}
          <span className="text-[10px] text-gray-300 font-mono border border-gray-100 px-1.5 py-0.5 rounded">
            statique · SSE bientôt
          </span>
        </div>
        {/* Filtres */}
        <div className="flex items-center gap-2">
          {/* Méthode */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {methods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterMethod(m)}
                className={cn(
                  "px-2 py-1 text-[10px] font-semibold rounded-md transition-colors",
                  filterMethod === m
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {m}
              </button>
            ))}
          </div>
          {/* Status */}
          <select
            aria-label="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-[10px] w-24 font-medium border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:border-indigo-300"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "Tous codes" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Thead */}
        <div className="grid grid-cols-[90px_1fr_120px_70px_80px_90px_80px] gap-2 px-4 py-2.5 border-b border-slate-200 bg-gray-50/60">
          {[
            "Heure",
            "Chemin",
            "IP client",
            "Méth.",
            "Code",
            "Latence",
            "Via",
          ].map((h) => (
            <span
              key={h}
              className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider"
            >
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Aucun log correspondant
          </div>
        ) : (
          <div className="max-h-70 overflow-y-scroll">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[90px_1fr_120px_70px_80px_90px_80px] gap-2 items-center px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                {/* Heure */}
                <span className="text-[10px] text-gray-500 font-mono tabular-nums">
                  {dateFormat(log.timestamp, "HH:mm:ss")}
                </span>
                {/* Chemin */}
                <span className="text-xs text-gray-600 font-mono truncate">
                  {log.path}
                </span>
                {/* IP */}
                <span className="text-xs text-gray-500 font-mono truncate">
                  {log.clientIp}
                </span>
                {/* Méthode */}
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded text-center font-mono",
                    getMethodColor(log.method),
                  )}
                >
                  {log.method}
                </span>
                {/* Code */}
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums text-center",
                    getStatusCodeColor(log.statusCode),
                  )}
                >
                  {log.statusCode}
                </span>
                {/* Latence */}
                <span
                  className={cn(
                    "text-xs tabular-nums text-right font-mono",
                    log.latencyMs > 500
                      ? "text-amber-600"
                      : log.latencyMs > 1000
                        ? "text-red-500"
                        : "text-gray-500",
                  )}
                >
                  {log.latencyMs}ms
                </span>
                {/* Via */}
                <span
                  className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded text-center",
                    log.via === "tunnel"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-blue-50 text-blue-600",
                  )}
                >
                  {log.via}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
