// components/network/RevokeServerConfirmModal.tsx
// Calé sur RevokeServerDto → DELETE /config/servers/:id
// { id }
// Utilisé sur la page détail du serveur

import { useState } from "react";
import { cn } from "@/utils/cn";
import { pause } from "@/constants";
import type { Server } from "@/types/nexusgate.type";
import { Close, Trash1 } from "@tailgrids/icons";
import { Spinner } from "../ui/Spinner";

interface RevokeConfirmModalProps {
  message?: string;
  server: Server;
  onClose: () => void;
  onConfirmed: () => Promise<void>;
}

export default function RevokeConfirmModal({
  message,
  server,
  onClose,
  onConfirmed,
}: RevokeConfirmModalProps) {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // L'utilisateur doit taper le nom exact du serveur
  const canRevoke = confirm.trim() === server.name;

  async function handleConfirm() {
    if (!canRevoke) return;
    setLoading(true);
    try {
      await pause(1200);
      // TODO: await serverService.revoke(server.id)
      // → DELETE /config/servers/:id
      await onConfirmed();
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
      aria-label="Supprimer le serveur"
    >
      <div className="bg-background-50 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden border border-base-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-error-100 bg-error-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-error-50 flex items-center justify-center text-error-500 border border-error-100">
              <Trash1 className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-semibold text-error-700">
              {message ? message : "Supprimer le serveur"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-error-400 hover:text-error-600 hover:bg-error-100 transition-colors disabled:opacity-40"
            aria-label="Fermer"
          >
            <Close />
          </button>
        </div>

        {/* Corps */}
        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Info serveur */}
          <div className="flex items-start gap-3 px-3.5 py-3 bg-background-soft-50 border border-base-200 rounded-xl">
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-sm font-semibold text-title-50 truncate">
                {server.name}
              </p>
              <p className="text-xs font-mono text-foreground-soft-500/60 truncate">
                {server.identifier}
              </p>
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded shrink-0",
                server.type === "CLOUD"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-orange-50 text-orange-600",
              )}
            >
              {server.type}
            </span>
          </div>

          {/* Avertissement */}
          <div className="flex items-start gap-2 px-3.5 py-3 bg-error-50 border border-error-100 rounded-xl">
            <svg
              viewBox="0 0 14 14"
              fill="none"
              className="w-3.5 h-3.5 text-error-500 shrink-0 mt-0.5"
            >
              <path
                d="M7 1L1 12h12L7 1z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M7 5.5v3M7 10v.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-xs text-error-600 leading-relaxed">
              Cette action est <strong>irréversible</strong>. Le serveur, toutes
              ses règles et ses logs seront définitivement modifiés.
            </p>
          </div>

          {/* Confirmation par saisie */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="revoke-confirm"
              className="text-xs text-foreground-soft-500"
            >
              Saisissez{" "}
              <span className="font-mono font-semibold text-title-50">
                {server.name}
              </span>{" "}
              pour confirmer
            </label>
            <input
              id="revoke-confirm"
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={server.name}
              disabled={loading}
              className={cn(
                "w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono text-title-50",
                "bg-background-50 placeholder:text-foreground-soft-500/30 transition-colors",
                "focus:outline-none focus:ring-2 focus:border-error-400 focus:ring-error-100",
                canRevoke ? "border-error-300" : "border-base-200",
                loading && "opacity-50 cursor-not-allowed",
              )}
            />
          </div>

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
              disabled={!canRevoke || loading}
              className="flex-1 rounded-xl bg-error-500 hover:bg-error-600 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Spinner size={"sm"} />}
              {loading ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
