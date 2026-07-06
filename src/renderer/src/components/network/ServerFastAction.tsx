import { cn } from "@/utils/cn";
import { Trash1, UserMultiple1 } from "@tailgrids/icons";
import { ShieldRuleIcon } from "../icons/ShieldRuleIcon";
import type { Server } from "@/types/nexusgate.type";
import KeyIcon from "../icons/KeyIcon";

export interface ServerFastActionProps {
  server: Server;
  setTokenAuth: () => void;
  setGrantUsers: () => void;
  setRevoke: () => void;
  setDeleteUser: () => void;
}

export default function ServerFastAction({
  server,
  setTokenAuth,
  setGrantUsers,
  setRevoke,
  setDeleteUser,
}: ServerFastActionProps) {
  return (
    <>
      {/* Actions rapides */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Actions rapides :
            </h2>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="grid grid-cols-2 gap-2">
            {/* Token Auth */}
            <button
              onClick={setTokenAuth}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-lg transition-colors",
                server.requireToken
                  ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-slate-200",
              )}
            >
              <KeyIcon className="w-3.5 h-3.5" />
              {server.requireToken ? "Token ON" : "Token OFF"}
            </button>

            {/* Grant Users */}
            <button
              onClick={setGrantUsers}
              className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-lg
                         bg-blue-50 text-blue-600 hover:bg-blue-100 
                         border border-blue-200 transition-colors"
            >
              <UserMultiple1 className="w-3.5 h-3.5" />
              Gérer accès
            </button>

            {/* Revoke */}
            <button
              onClick={setRevoke}
              className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-lg
                         bg-purple-50 text-purple-600 hover:bg-purple-100 
                         border border-purple-200 transition-colors"
            >
              <ShieldRuleIcon className="w-3.5 h-3.5" />
              Révoquer
            </button>

            {/* Delete Server */}
            <button
              type="button"
              onClick={setDeleteUser}
              className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-lg
                         bg-red-50 text-red-500 hover:bg-red-100 
                         border border-red-200 transition-colors"
            >
              <Trash1 className="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
