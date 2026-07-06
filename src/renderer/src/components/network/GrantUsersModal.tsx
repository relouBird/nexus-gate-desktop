// components/network/GrantUsersModal.tsx
// Calé sur GrantServerDto → PATCH /config/servers/:id/grant
// { id, userIds: string[] }
//
// Logique inverse de AccessPolicyEditor :
//   AccessPolicyEditor → on choisit des serverIds pour un User
//   GrantUsersModal    → on choisit des userIds pour un Server

import { useState } from "react";
import { cn } from "@/utils/cn";
import { pause } from "@/constants";
import type { Server, UserModel } from "@/types/nexusgate.type";
import { roleLabel } from "@/helpers/user.helper";
import { Spinner } from "../ui/Spinner";
import { Close } from "@tailgrids/icons";

interface GrantUsersModalProps {
  server: Server;
  /** Liste de tous les membres de la team (hors CREATOR) */
  users: UserModel[];
  /** IDs déjà autorisés sur ce serveur */
  currentUserIds: string[];
  onClose: () => void;
  onConfirmed: (userIds: string[]) => Promise<void>;
}

export default function GrantUsersModal({
  server,
  users,
  currentUserIds,
  onClose,
  onConfirmed,
}: GrantUsersModalProps) {
  // Filtre : on exclut le CREATOR (accès implicite toujours)
  const grantableUsers = users.filter((u) => u.role !== "CREATOR");

  const [selected, setSelected] = useState<string[]>(currentUserIds);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Helpers sélection ────────────────────────────────────────

  const allSelected = selected.length === grantableUsers.length;

  function toggleAll() {
    setSelected(allSelected ? [] : grantableUsers.map((u) => u.id));
  }

  function toggleUser(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  // ── Filtrage recherche ───────────────────────────────────────

  const filtered = grantableUsers.filter(
    (u) =>
      !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Submit ───────────────────────────────────────────────────

  async function handleConfirm() {
    setLoading(true);
    try {
      await pause(1200);
      await onConfirmed(selected);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  // ── Résumé des changements ───────────────────────────────────
  const added = selected.filter((id) => !currentUserIds.includes(id)).length;
  const removed = currentUserIds.filter((id) => !selected.includes(id)).length;
  const hasChanges = added > 0 || removed > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Gérer les accès utilisateurs"
    >
      <div className="bg-background-50 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-base-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
              <UsersGrantIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-title-50">
                Accès utilisateurs
              </h3>
              <p className="text-[10px] text-foreground-soft-500/60 font-mono truncate max-w-48">
                {server.name}
              </p>
            </div>
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

        {/* Body */}
        <div className="flex flex-col gap-3 px-5 py-4 overflow-y-auto">
          {/* Recherche */}
          <div className="relative">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-soft-500/40 pointer-events-none"
            >
              <circle cx="6.5" cy="6.5" r="4" />
              <path d="M10 10l3 3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-base-200 rounded-xl bg-background-50 text-title-50 placeholder:text-foreground-soft-500/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200/50 transition"
            />
          </div>

          {/* Liste */}
          <div className="border border-base-200 rounded-xl overflow-hidden">
            {/* Toggle tout */}
            {!search && (
              <label className="flex items-center gap-3 px-4 py-2.5 bg-background-soft-50 border-b border-base-200 cursor-pointer hover:bg-background-soft-100 transition-colors">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 accent-indigo-500 focus:ring-indigo-200"
                />
                <span className="text-xs font-semibold text-foreground-soft-500">
                  Tous les membres
                </span>
                <span className="ml-auto text-[10px] text-foreground-soft-500/40">
                  {selected.length}/{grantableUsers.length}
                </span>
              </label>
            )}

            {/* Utilisateurs */}
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-foreground-soft-500/50">
                Aucun utilisateur trouvé
              </div>
            ) : (
              filtered.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-base-100 last:border-0 cursor-pointer hover:bg-background-soft-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="w-4 h-4 rounded border-gray-300 accent-indigo-500 focus:ring-indigo-200 shrink-0"
                  />
                  {/* Avatar initial */}
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-semibold shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-title-50 truncate">
                      {user.username}
                    </p>
                    <p className="text-[10px] text-foreground-soft-500/60 truncate">
                      {user.email}
                    </p>
                  </div>
                  {/* Rôle */}
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                      roleLabel[user.role].color,
                    )}
                  >
                    {roleLabel[user.role].label}
                  </span>
                </label>
              ))
            )}
          </div>

          {/* Résumé des changements */}
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-100 rounded-lg">
              <svg
                viewBox="0 0 12 12"
                fill="none"
                className="w-3.5 h-3.5 text-primary-500 shrink-0"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M4 6l1.5 1.5L8 4.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xs text-primary-700">
                {added > 0 && (
                  <span>
                    <strong>+{added}</strong> ajouté{added > 1 ? "s" : ""}
                  </span>
                )}
                {added > 0 && removed > 0 && <span className="mx-1">·</span>}
                {removed > 0 && (
                  <span>
                    <strong>−{removed}</strong> retiré{removed > 1 ? "s" : ""}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-base-200 shrink-0">
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
            disabled={loading || !hasChanges}
            className="flex-1 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Spinner size={"sm"} />}
            {loading
              ? "Application..."
              : `Appliquer${selected.length > 0 ? ` (${selected.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────

function UsersGrantIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1 13c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
      <path d="M11 7.5l1.5 1.5L15 6" />
    </svg>
  );
}
