import {
  RULE_TYPE_LABELS,
  ACTION_COLORS,
  RULE_DEFAULTS,
  type SupportedRuleType,
} from "@/helpers/rule.helper";
import type { Rule, RuleType, ActionType } from "@/types/nexusgate.type";
import { cn } from "@/utils/cn";
import { Xmark2x } from "@tailgrids/icons";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { ShieldRuleIcon } from "../icons/ShieldRuleIcon";

interface RuleModalProps {
  serverId: string;
  onClose: () => void;
  onSave: (rule: Rule) => void;
}

export default function RuleModal({
  serverId,
  onClose,
  onSave,
}: RuleModalProps) {
  const [type, setType] = useState<SupportedRuleType>("IP_BLACKLIST");
  const [valuesRaw, setValuesRaw] = useState("");
  const [maxRequests, setMaxRequests] = useState("100");
  const [windowSeconds, setWindowSeconds] = useState("60");
  const [priority, setPriority] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const cfg = RULE_DEFAULTS[type];

  // Fermer sur click backdrop
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  // Fermer sur Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function buildCondition(): Record<string, unknown> {
    if (type === "RATE_LIMIT") {
      return {
        maxRequests: Number(maxRequests),
        windowSeconds: Number(windowSeconds),
      };
    }
    if (type === "CONTINENT_BLACKLIST") {
      return {
        continents: valuesRaw
          .split(",")
          .map((v) => v.trim().toUpperCase())
          .filter(Boolean),
      };
    }
    if (type.startsWith("COUNTRY")) {
      return {
        countries: valuesRaw
          .split(",")
          .map((v) => v.trim().toUpperCase())
          .filter(Boolean),
      };
    }
    // IP rules
    return {
      values: valuesRaw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    };
  }

  function validate(): string | null {
    if (type === "RATE_LIMIT") {
      if (!maxRequests || Number(maxRequests) < 1)
        return "Entrez un nombre de requêtes valide.";
      if (!windowSeconds || Number(windowSeconds) < 1)
        return "Entrez une fenêtre de temps valide.";
      return null;
    }
    const values = valuesRaw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length === 0) return "Entrez au moins une valeur.";
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      serverId,
      type: type as RuleType,
      condition: buildCondition(),
      action: cfg.action as ActionType,
      priority: Number(priority),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(newRule);
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ajouter une règle"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <ShieldRuleIcon className="w-4 h-4 text-indigo-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              Ajouter une règle
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <Xmark2x />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          {/* Type de règle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Type de règle
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(RULE_DEFAULTS) as SupportedRuleType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setValuesRaw("");
                    setError(null);
                  }}
                  className={cn(
                    "text-left text-xs px-3 py-2 rounded-lg border transition-colors font-medium",
                    type === t
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                  )}
                >
                  {RULE_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Champs selon le type */}
          {type === "RATE_LIMIT" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="maxReq"
                  className="text-xs font-medium text-gray-500"
                >
                  Requêtes max
                </label>
                <input
                  id="maxReq"
                  type="number"
                  min="1"
                  value={maxRequests}
                  onChange={(e) => {
                    setMaxRequests(e.target.value);
                    setError(null);
                  }}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                  placeholder="100"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="windowSec"
                  className="text-xs font-medium text-gray-500"
                >
                  Fenêtre (secondes)
                </label>
                <input
                  id="windowSec"
                  type="number"
                  min="1"
                  value={windowSeconds}
                  onChange={(e) => {
                    setWindowSeconds(e.target.value);
                    setError(null);
                  }}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                  placeholder="60"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="ruleValues"
                className="text-xs font-medium text-gray-500"
              >
                {cfg.inputLabel}
              </label>
              <textarea
                id="ruleValues"
                rows={3}
                value={valuesRaw}
                onChange={(e) => {
                  setValuesRaw(e.target.value);
                  setError(null);
                }}
                placeholder={cfg.placeholder}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 font-mono resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {cfg.hint}
              </p>
            </div>
          )}

          {/* Priorité */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="priority"
              className="text-xs font-medium text-gray-500"
            >
              Priorité{" "}
              <span className="text-gray-400 font-normal">
                (plus élevé = évalué en premier)
              </span>
            </label>
            <input
              id="priority"
              type="number"
              min="0"
              max="1000"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
            />
          </div>

          {/* Action info */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              Action
            </span>
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded ml-auto",
                ACTION_COLORS[cfg.action],
              )}
            >
              {cfg.action}
            </span>
            <span className="text-[10px] text-gray-400">
              définie par le type de règle
            </span>
          </div>

          {/* Erreur */}
          {error && (
            <p
              className="text-xs text-red-500 flex items-center gap-1.5"
              role="alert"
            >
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M6 4v2.5M6 8v.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              Ajouter la règle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
