// components/network/TokenAuthConfirmModal.tsx
// Calé sur TokenAuthServerDto → PATCH /config/servers/:id/token-auth
// { id, requireToken: boolean }
// Utilisé sur la page détail du serveur

import { useState } from "react";
import { cn } from "@/utils/cn";
import { pause } from "@/constants";
import ServerIcon from "../icons/ServerIcon";
import { Spinner } from "../ui/Spinner";
import { Close } from "@tailgrids/icons";
import KeyIcon from "../icons/KeyIcon";

interface TokenAuthConfirmModalProps {
  serverName: string;
  currentValue: boolean;
  onClose: () => void;
  onConfirmed: (newValue: boolean) => Promise<void>;
}

export default function TokenAuthConfirmModal({
  serverName,
  currentValue,
  onClose,
  onConfirmed,
}: TokenAuthConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const nextValue = !currentValue;

  async function handleConfirm() {
    setLoading(true);
    try {
      await pause(1000);
      // TODO: await serverService.setTokenAuth(serverId, nextValue)
      // → PATCH /config/servers/:id/token-auth  { requireToken: nextValue }
      await onConfirmed(nextValue);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Modifier l'authentification par token"
    >
      <div className="bg-background-50 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden border border-base-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-200">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center",
                nextValue
                  ? "bg-purple-50 text-purple-500"
                  : "bg-gray-100 text-gray-400",
              )}
            >
              <KeyIcon />
            </div>
            <h3 className="text-sm font-semibold text-title-50">
              Authentification par token
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-soft-500 hover:text-title-50 hover:bg-background-soft-100 transition-colors disabled:opacity-40"
            aria-label="Fermer"
          >
            <Close />
          </button>
        </div>

        {/* Corps */}
        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Serveur concerné */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-background-soft-50 border border-base-200 rounded-xl">
            <ServerIcon className="w-5 h-5" />
            <p className="text-sm font-medium text-title-50 truncate">
              {serverName}
            </p>
          </div>

          {/* État actuel → futur */}
          <div className="flex items-center justify-between gap-3 px-1">
            <StateChip
              active={currentValue}
              label={currentValue ? "Token requis" : "Accès libre"}
            />
            <svg
              viewBox="0 0 16 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="w-10 h-4 text-foreground-soft-500/40 shrink-0"
            >
              <path d="M1 4h14M11 1l3 3-3 3" />
            </svg>
            <StateChip
              active={nextValue}
              label={nextValue ? "Token requis" : "Accès libre"}
              highlighted
            />
          </div>

          {/* Description */}
          <p className="text-xs text-foreground-soft-500 leading-relaxed">
            {nextValue
              ? "Les requêtes vers ce serveur devront inclure un <strong>GatewayToken valide</strong>. Les requêtes sans token recevront une erreur 401."
              : "Ce serveur deviendra <strong>accessible sans token</strong>. Seule la politique d'accès utilisateur s'appliquera encore."}
          </p>

          {/* Boutons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-base-200 px-4 py-2 text-sm font-medium text-foreground-soft-500 hover:bg-background-soft-100 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
                nextValue
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-primary-500 hover:bg-primary-600",
              )}
            >
              {loading && <Spinner size={"sm"} />}
              {loading ? "Application..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-composant ────────────────────────────────────────────

function StateChip({
  active,
  label,
  highlighted,
}: {
  active: boolean;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border",
        highlighted
          ? active
            ? "bg-purple-50 border-purple-200 text-purple-700"
            : "bg-gray-100 border-gray-200 text-gray-600"
          : "bg-background-soft-50 border-base-200 text-foreground-soft-500",
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          active ? "bg-purple-400" : "bg-gray-300",
        )}
      />
      {label}
    </span>
  );
}
