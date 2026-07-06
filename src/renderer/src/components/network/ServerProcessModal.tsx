// components/network/ServerProcessModal.tsx
// Calé sur :
//   CreateServerDto → POST /config/servers  { name, url?, type? }
//   UpdateServerDto → PATCH /config/servers/:id  { name?, url?, type? }

import { useState, type FormEvent } from "react";
import { cn } from "@/utils/cn";
import {
  ServerTypes,
  type Server,
  type ServerType,
} from "@/types/nexusgate.type";
import { pause } from "@/constants";
import ServerIcon from "../icons/ServerIcon";
import { Spinner } from "../ui/Spinner";
import ModalHeader from "../gen/ModalHeader";
import { UserPencil } from "@tailgrids/icons";
import { FieldGroup } from "../account/UtilsParam";
import { AuthInput } from "../auth/AuthFormparts";

// Formulaires
import useForm from "@/composables/useForm";
import * as yup from "yup";

// ─── Types locaux ────────────────────────────────────────────

export interface ServerProcessData {
  name: string;
  url: string;
  type: ServerType;
}

interface ServerProcessModalProps {
  /** Absent → mode création, présent → mode mise à jour */
  server?: Server;
  onClose: () => void;
  onProcess: (server: ServerProcessData) => Promise<void>;
  disabled?: boolean;
}

// ─── Modal ────────────────────────────────────────────────────

export default function ServerProcessModal({
  server,
  onClose,
  onProcess,
  disabled = false,
}: ServerProcessModalProps) {
  const isEdit = !!server;

  // 🔹 Créer un formulaire réactif
  const formTemplate = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      name: yup
        .string()
        .trim()
        .required("Le nom est requis.")
        .min(2, "Minimum 2 caractères."),
      type: yup.string().required(),
      url: yup
        .string()
        .trim()
        .when("type", {
          is: ServerTypes.CLOUD,
          then: (schema) =>
            schema.required("L'URL cible est requise pour un serveur Cloud."),
          otherwise: (schema) => schema.notRequired(),
        })
        .test(
          "is-valid-url",
          "L'URL doit commencer par http:// ou https://",
          (value) => !value || /^https?:\/\/.+/.test(value),
        ),
    }),
    // Valeurs initiales par défaut
    {
      name: server?.name ?? "",
      type: server?.type ?? ServerTypes.CLOUD, // Ou "CLOUD" selon votre valeur par défaut
      url: server?.url ?? "",
    },
  );

  const [loading, setLoading] = useState(false);

  // ── Submit ──────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const isValid = await formTemplate.validate();

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      await pause(1500);
      // TODO création :  await serverService.create({ name, url, type })
      //      → POST /config/servers — retourne le Server complet avec identifier généré
      // TODO mise à jour : await serverService.update(server.id, { name, url, type })
      //      → PATCH /config/servers/:id

      // Mock : on simule le retour du backend
      const result = {
        name: formTemplate.data.name.trim(),
        url: formTemplate.data.url?.trim() ?? "",
        type: formTemplate.data.type as ServerType,
      };

      await onProcess(result);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Modifier le serveur" : "Créer un serveur"}
    >
      <div className="bg-background-50 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-base-200">
        {/* Header */}
        <ModalHeader
          title={server ? `Modifier — ${server.name}` : "Créer un Serveur"}
          icon={server ? <UserPencil /> : <ServerIcon />}
          onClose={onClose}
        />

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          {/* Nom */}
          <FieldGroup
            label="Nom du serveur"
            htmlFor="srv-name"
            error={formTemplate.errors.name?.toLocaleString()}
            hint="Ex: API Production, Auth Microservice…"
          >
            <AuthInput
              id="srv-name"
              value={formTemplate.data.name}
              onChange={(v) => formTemplate.setData("name", v.target.value)}
              onBlur={() => formTemplate.validateField("name")}
              placeholder="ex: API Production"
              hasError={!!formTemplate.errors.name}
              disabled={loading || disabled}
            />
          </FieldGroup>

          {/* Type CLOUD / LOCAL */}
          <FieldGroup label="Type" htmlFor="srv-type">
            <div className="flex gap-2">
              {([ServerTypes.CLOUD, ServerTypes.LOCAL] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={loading || disabled}
                  onClick={() => {
                    formTemplate.setData("type", t);
                    // Vide l'URL si on passe en LOCAL
                    if (t === ServerTypes.LOCAL)
                      formTemplate.setData("url", "");
                  }}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors focus:outline-none focus:ring focus:ring-primary-300/40 focus:border-primary-400",
                    formTemplate.data.type === t
                      ? t === "CLOUD"
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-orange-300 bg-orange-50 text-orange-700"
                      : "border-base-200 bg-background-50 text-foreground-soft-500 hover:border-base-300 hover:text-title-50",
                    (loading || disabled) && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {t === ServerTypes.CLOUD ? "☁ Cloud" : "⬡ Local"}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-foreground-soft-500/50 mt-0.5">
              {formTemplate.data.type === ServerTypes.CLOUD
                ? "Proxifie vers une URL distante. L'URL cible est requise."
                : "Tunnelisé depuis l'agent Desktop. Pas d'URL requise."}
            </p>
          </FieldGroup>

          {/* URL — visible seulement pour CLOUD */}
          {formTemplate.data.type === ServerTypes.CLOUD && (
            <FieldGroup
              label="URL cible"
              htmlFor="srv-url"
              error={formTemplate.errors.url?.toLocaleString()}
              hint="URL de votre API — ex: https://api.techcorp.com"
            >
              <AuthInput
                id="srv-url"
                value={formTemplate.data.url}
                onChange={(v) => formTemplate.setData("url", v.target.value)}
                onBlur={() => formTemplate.validateField("url")}
                placeholder="https://api.techcorp.com"
                hasError={!!formTemplate.errors.url}
                disabled={loading || disabled}
              />
            </FieldGroup>
          )}

          {/* Identifier (lecture seule en mode édition) */}
          {isEdit && server?.identifier && (
            <FieldGroup label="Identifiant" htmlFor="srv-identifier">
              <AuthInput
                id="srv-identifier"
                type="text"
                readOnly
                value={server.identifier}
                className="w-full rounded-xl border border-base-100 bg-background-soft-50 px-3.5 py-2.5 text-sm font-mono text-foreground-soft-500 cursor-default"
              />
            </FieldGroup>
          )}

          {/* Footer */}
          {!disabled && (
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-base-200 px-4 py-2 text-sm font-medium text-foreground-soft-500 hover:bg-background-soft-100 transition-colors disabled:opacity-50 focus:outline-none"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none"
              >
                {loading && <Spinner size={"sm"} />}
                {loading
                  ? isEdit
                    ? "Mise à jour..."
                    : "Création..."
                  : isEdit
                    ? "Mettre à jour"
                    : "Créer le serveur"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
