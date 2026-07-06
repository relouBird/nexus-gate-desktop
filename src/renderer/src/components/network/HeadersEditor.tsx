// components/network/HeadersEditor.tsx
import { useState } from "react";
import { Plus, Trash1 } from "@tailgrids/icons";
import { cn } from "@/utils/cn";
import { Spinner } from "../ui/Spinner";

interface HeaderEntry {
  id: string; // identifiant unique temporaire
  key: string;
  value: string;
}

interface HeadersEditorProps {
  /** Headers existants sous forme d'objet { "Authorization": "Bearer xxx", ... } */
  headers?: Record<string, string>;
  /** Callback avec l'objet mis à jour */
  onChange: (headers: Record<string, string>) => void;
  onValid: () => Promise<void>;
  /** Désactiver l'édition */
  disabled?: boolean;
}

let entryCounter = 0;

export default function HeadersEditor({
  headers = {},
  onChange,
  onValid,
  disabled = false,
}: HeadersEditorProps) {
  // Convertir l'objet en tableau d'entrées
  const initialEntries: HeaderEntry[] = Object.entries(headers).map(
    ([key, value]) => ({
      id: `header-${++entryCounter}`,
      key,
      value,
    }),
  );

  const [isLoading, setIsLoading] = useState(false);

  const [entries, setEntries] = useState<HeaderEntry[]>(
    initialEntries.length > 0
      ? initialEntries
      : [{ id: `header-${++entryCounter}`, key: "", value: "" }],
  );

  // ─── Helpers ──────────────────────────────────────────────

  function updateEntries(newEntries: HeaderEntry[]) {
    setEntries(newEntries);

    // Convertir en objet pour le parent
    const obj: Record<string, string> = {};
    newEntries.forEach((entry) => {
      if (entry.key.trim()) {
        obj[entry.key.trim()] = entry.value;
      }
    });
    onChange(obj);
  }

  function handleKeyChange(id: string, newKey: string) {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, key: newKey } : entry,
    );
    updateEntries(updated);
  }

  function handleValueChange(id: string, newValue: string) {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, value: newValue } : entry,
    );
    updateEntries(updated);
  }

  function handleAdd() {
    // Vérifier que la dernière entrée a une clé non vide
    const lastEntry = entries[entries.length - 1];
    if (lastEntry && !lastEntry.key.trim()) {
      // Ne pas ajouter si la dernière clé est vide
      return;
    }

    // Vérifier les doublons de clé
    const keys = entries.map((e) => e.key.trim()).filter(Boolean);
    if (lastEntry && keys.includes(lastEntry.key.trim())) {
      // Vérifier si la dernière clé n'est pas en double
      const duplicateCount = keys.filter(
        (k) => k === lastEntry.key.trim(),
      ).length;
      if (duplicateCount > 1) return;
    }

    updateEntries([
      ...entries,
      { id: `header-${++entryCounter}`, key: "", value: "" },
    ]);
  }

  function handleRemove(id: string) {
    if (entries.length <= 1) {
      // Garder une ligne vide au minimum
      updateEntries([{ id: `header-${++entryCounter}`, key: "", value: "" }]);
      return;
    }
    updateEntries(entries.filter((entry) => entry.id !== id));
  }

  // ─── Rendu ────────────────────────────────────────────────

  const onSetAction = async () => {
    setIsLoading(true);
    try {
      await onValid();
    } catch (error) {
      console.log("Erreur ==>", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Headers HTTP
        </label>
        <div className="flex items-center justify-end gap-2.5">
          <span className="text-[10px] text-gray-400">
            {entries.filter((e) => e.key.trim()).length} header(s)
          </span>

          <button
            type="button"
            onClick={onSetAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors"
          >
            {isLoading ? (
              <>
                Ajout... <Spinner size={"sm"} />
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" /> Ajouter
              </>
            )}
          </button>
        </div>
      </div>

      {/* Liste des headers */}
      <div className="flex flex-col gap-2">
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;
          const isKeyEmpty = !entry.key.trim();
          const isDuplicate =
            entry.key.trim() &&
            entries.filter((e) => e.key.trim() === entry.key.trim()).length > 1;

          return (
            <div
              key={entry.id}
              className={cn(
                "flex items-start gap-2",
                isKeyEmpty && !isLast && "opacity-40", // Grise les lignes vides intermédiaires
              )}
            >
              {/* Input clé */}
              <div className="flex-1 flex flex-col gap-0.5">
                <input
                  type="text"
                  value={entry.key}
                  onChange={(e) => handleKeyChange(entry.id, e.target.value)}
                  placeholder="Propriété (ex: Authorization)"
                  disabled={disabled}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm font-mono text-gray-700",
                    "placeholder:text-gray-300 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400",
                    isDuplicate
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-200",
                    disabled && "bg-gray-50 cursor-not-allowed opacity-60",
                  )}
                />
                {isDuplicate && (
                  <span className="text-[10px] text-amber-600">
                    Clé en double
                  </span>
                )}
              </div>

              {/* Input valeur */}
              <div className="flex-[1.5] flex flex-col gap-0.5">
                <input
                  type="text"
                  value={entry.value}
                  onChange={(e) => handleValueChange(entry.id, e.target.value)}
                  placeholder="Valeur"
                  disabled={disabled}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm text-gray-700",
                    "placeholder:text-gray-300 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400",
                    isDuplicate
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-200",
                    disabled && "bg-gray-50 cursor-not-allowed opacity-60",
                  )}
                />
              </div>

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={() => handleRemove(entry.id)}
                disabled={disabled || (entries.length === 1 && isKeyEmpty)}
                className={cn(
                  "mt-0.5 w-8 h-9 rounded-lg flex items-center justify-center shrink-0",
                  "text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                )}
                aria-label="Supprimer ce header"
              >
                <Trash1 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bouton Ajouter */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl border-2 border-dashed border-slate-300 px-4 py-3",
          "text-sm font-medium text-gray-500",
          "hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50",
          "transition-all duration-200",
          "flex items-center justify-center gap-2",
          disabled &&
            "opacity-50 cursor-not-allowed hover:border-slate-300 hover:text-gray-500 hover:bg-transparent",
        )}
      >
        <Plus className="w-4 h-4" />
        Ajouter un header
      </button>

      {/* Résumé */}
      {entries.filter((e) => e.key.trim()).length > 0 && (
        <div className="bg-gray-50 border border-slate-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Aperçu
          </p>
          <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap break-all">
            {JSON.stringify(
              Object.fromEntries(
                entries
                  .filter((e) => e.key.trim())
                  .map((e) => [e.key.trim(), e.value]),
              ),
              null,
              2,
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
