import { dateFormat } from "@/helpers";
import { getMethodColor, getStatusCodeColor } from "@/helpers/server.helper";
import type { RequestLog } from "@/types/nexusgate.type";

export default function LogRow({ log }: { log: RequestLog }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-slate-100 last:border-0">
      <span
        className={`text-xs font-semibold px-1.5 py-0.5 rounded font-mono w-14 text-center shrink-0 ${getMethodColor(log.method)}`}
      >
        {log.method}
      </span>
      <span className="text-xs text-gray-500 font-mono flex-1 truncate">
        {log.path}
      </span>
      <span className="text-xs text-gray-400 truncate hidden sm:block max-w-30">
        {log.serverName}
      </span>
      <span
        className={`text-xs font-semibold w-10 text-right shrink-0 ${getStatusCodeColor(log.statusCode)}`}
      >
        {log.statusCode}
      </span>
      <span className="text-xs text-gray-400 w-14 text-right shrink-0">
        {log.latencyMs}ms
      </span>
      <span className="text-xs text-gray-300 w-10 text-right shrink-0">
        {dateFormat(log.timestamp, "HH:mm")}
      </span>
    </div>
  );
}
