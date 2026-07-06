import { getServerStatus } from "@/helpers/server.helper";
import {
  ServerTypes,
  type Server,
} from "@/types/nexusgate.type";
import ServerIcon from "../icons/ServerIcon";
import StatusBadge from "./StatusBadge";

export default function ServerPreviewCard({
  server,
  onClick,
}: {
  server: Server;
  onClick: () => void;
}) {
  const status = getServerStatus(server);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0">
        <ServerIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {server.name}
        </p>
        <p className="text-xs text-gray-400 font-mono truncate">
          {server.identifier}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={status} />
        <span
          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            server.type === ServerTypes.CLOUD
              ? "bg-blue-50 text-blue-600"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {server.type}
        </span>
      </div>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors"
      >
        <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
