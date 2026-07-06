import {
  type ServerStatusType,
  ServerStatusTypes,
} from "@/types/nexusgate.type";

export default function StatusBadge({
  status,
  isActive,
}: {
  status: ServerStatusType;
  isActive?: boolean;
}) {
  const config = {
    [ServerStatusTypes.ONLINE]: {
      dot: "bg-emerald-400",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      label: "En ligne",
    },
    [ServerStatusTypes.TUNNEL]: {
      dot: "bg-emerald-400",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      label: "Tunnel actif",
    },
    [ServerStatusTypes.OFFLINE]: {
      dot: "bg-gray-300",
      text: "text-gray-500",
      bg: "bg-gray-100",
      label: "Hors ligne",
    },
    [ServerStatusTypes.ERROR]: {
      dot: "bg-error-300",
      text: "text-error-500",
      bg: "bg-error-100",
      label: "Erreur",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}
    >
      {isActive && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {config.label}
    </span>
  );
}
