// ─── RULES TABLE ───────────────────────────────────────────────

import {
  RULE_TYPE_LABELS,
  ruleConditionSummary,
  ACTION_COLORS,
} from "@/helpers/rule.helper";
import type { Rule } from "@/types/nexusgate.type";
import { cn } from "@/utils/cn";
import { Plus, Trash1 } from "@tailgrids/icons";
import { ShieldRuleIcon } from "../icons/ShieldRuleIcon";

export default function RuleTable({
  rules,
  onToggle,
  onDelete,
  onAdd,
}: {
  rules: Rule[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Règles de filtrage
          </h2>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-slate-200 text-gray-500">
            {rules.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" /> Ajouter
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center bg-white border border-slate-200 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
            <ShieldRuleIcon className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-sm text-gray-500">Aucune règle configurée</p>
          <p className="text-xs text-gray-400">
            Cliquez sur "Ajouter" pour protéger ce serveur.
          </p>
        </div>
      ) : (
        <div className="bg-white border h-50 border-slate-200 rounded-xl overflow-hidden">
          {/* Thead */}
          <div className="grid grid-cols-[1fr_1.4fr_80px_80px_60px_80px] gap-3 px-4 py-2.5 border-b border-slate-200 bg-gray-50/60">
            {["Type", "Condition", "Action", "Priorité", "Actif", ""].map(
              (h) => (
                <span
                  key={h}
                  className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </span>
              ),
            )}
          </div>
          {/* Rows */}
          <div className="h-41 overflow-y-scroll">
            {[...rules]
              .sort((a, b) => b.priority - a.priority)
              .map((rule) => (
                <div
                  key={rule.id}
                  className={cn(
                    "grid grid-cols-[1fr_1.4fr_80px_80px_60px_80px] gap-3 items-center px-4 py-3 border-b border-gray-50 last:border-0 transition-colors",
                    !rule.isActive && "opacity-50",
                  )}
                >
                  {/* Type */}
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {RULE_TYPE_LABELS[rule.type] ?? rule.type}
                  </span>
                  {/* Condition */}
                  <span className="text-xs text-gray-500 font-mono truncate">
                    {ruleConditionSummary(rule)}
                  </span>
                  {/* Action */}
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded text-center",
                      ACTION_COLORS[rule.action],
                    )}
                  >
                    {rule.action}
                  </span>
                  {/* Priorité */}
                  <span className="text-xs text-gray-400 text-center">
                    {rule.priority}
                  </span>
                  {/* Toggle actif */}
                  <button
                    type="button"
                    onClick={() => onToggle(rule.id)}
                    aria-label={
                      rule.isActive ? "Désactiver la règle" : "Activer la règle"
                    }
                    className={cn(
                      "relative w-8 h-4.5 rounded-full transition-colors duration-200 focus:outline-none",
                      rule.isActive ? "bg-indigo-500" : "bg-gray-400",
                    )}
                    style={{ height: "18px" }}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200",
                        rule.isActive ? "translate-x-0" : "-translate-x-3.5",
                      )}
                    />
                  </button>
                  {/* Supprimer */}
                  <button
                    type="button"
                    onClick={() => onDelete(rule.id)}
                    aria-label="Supprimer la règle"
                    className="w-6 h-6 rounded-sm flex items-center justify-center text-red-500 bg-red-50 transition-colors"
                  >
                    <Trash1 className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
