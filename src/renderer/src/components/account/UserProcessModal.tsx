import { pause } from '@/constants'
import { generatePassword, roleLabel } from '@/helpers/user.helper'
import type { AccessPolicy, Server, UserModel, UserRole } from '@/types/nexusgate.type'
import type { CreateUserPayload, UserCreateRole } from '@/types/user.type'
import { cn } from '@/utils/cn'
import { useState, type FormEvent } from 'react'
import {
  AuthInput,
  PasswordInput,
  AuthDivider,
  PasswordStrength,
  SubmitButton
} from '../auth/AuthFormparts'
import UserPlusIcon from '../icons/UserPlusIcon'
import { FieldGroup } from './UtilsParam'
import AccessPolicyEditor from './AccessPolicyEditor'
import ModalHeader from '../gen/ModalHeader'
import ModalOverlay from '../gen/ModalOverlay'
import { RefreshCircle1Clockwise, Copy4, Check, UserPencil } from '@tailgrids/icons'

// Formulaires
import useForm from '@/composables/useForm'
import * as yup from 'yup'
import ModalUserInfos from '../gen/ModalUserInfos'
import { Spinner } from '../ui/Spinner'

interface UserProcessModalProps {
  user?: UserModel
  servers: Server[]
  onClose: () => void
  disabled?: boolean
  onProcess: (user: CreateUserPayload) => Promise<void>
  onRemoveProcess?: (id: string) => Promise<void>
  viewerRole: UserRole
}

export default function UserProcessModal({
  user,
  servers,
  onClose,
  onProcess,
  onRemoveProcess,
  viewerRole,
  disabled
}: UserProcessModalProps): React.JSX.Element {
  // 🔹 Créer un formulaire réactif
  const formTemplate = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      username: yup
        .string()
        .trim()
        .required('Requis.')
        .min(2, 'Minimum 2 caractères.')
        .matches(/^[a-zA-Z0-9_.-]+$/, 'Lettres, chiffres, _ . - uniquement.'),
      email: yup.string().trim().required('Requis.').email('Email invalide.'),
      password: yup
        .string()
        .required('Requis.')
        .min(8, 'Minimum 8 caractères.')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/,
          'Doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.'
        )
    }),
    {
      username: user?.username ?? undefined,
      email: user?.email ?? '',
      password: user ? undefined : generatePassword() // Assurez-vous que cette fonction génère un mot de passe qui respecte aussi ces critères !
    }
  )
  const [role, setRole] = useState<UserCreateRole>(user ? (user.role as UserCreateRole) : 'CLIENT')
  const [policy, setPolicy] = useState<AccessPolicy>(
    user
      ? user.accessPolicy
      : {
          mode: 'include',
          serverIds: ['*']
        }
  )

  // Non Fonctionnels
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // En cass de suppression
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleGenerate(): void {
    const pwd = generatePassword()
    formTemplate.setData('password', pwd)
  }

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(formTemplate.data.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    const isValid = await formTemplate.validate()

    if (!isValid && !user) {
      return
    } else if (formTemplate.errors.username?.length && user) {
      return
    }

    setLoading(true)
    try {
      await pause(1800)

      const newUser: CreateUserPayload = {
        username: formTemplate.data.username,
        password: formTemplate.data.password,
        email: formTemplate.data.email,
        role: role,
        accessPolicy: policy
      }
      await onProcess(newUser)
      onClose()
    } finally {
      setLoading(false)
    }
  }
  async function handleDelete(): Promise<void> {
    setDeleteLoading(true)
    try {
      await pause(1500)
      if (onRemoveProcess) {
        onRemoveProcess(String(user?.id))
      }
      onClose()
    } finally {
      setDeleteLoading(false)
    }
  }

  // Roles disponibles selon le viewer
  const availableRoles: Array<'ADMIN' | 'CLIENT'> =
    viewerRole === 'CREATOR' ? ['ADMIN', 'CLIENT'] : ['CLIENT']

  return (
    <ModalOverlay onClose={onClose}>
      <ModalHeader
        title={user ? `Modifier — ${user.username}` : 'Créer un utilisateur'}
        icon={user ? <UserPencil /> : <UserPlusIcon />}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-4 px-5 py-5">
          {/* Infos lecture seule */}
          {user && <ModalUserInfos user={user} />}

          {/* Username + Email */}
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup
              label="Nom d'utilisateur"
              htmlFor="c-username"
              error={formTemplate.errors.username?.toLocaleString()}
            >
              <AuthInput
                id="c-username"
                value={formTemplate.data.username}
                onChange={(v) => formTemplate.setData('username', v.target.value)}
                onBlur={() => formTemplate.validateField('username')}
                placeholder="alice_martin"
                hasError={!!formTemplate.errors.username}
                disabled={loading || disabled}
              />
            </FieldGroup>
            <FieldGroup
              label="Adresse email"
              htmlFor="c-email"
              error={formTemplate.errors.email?.toLocaleString()}
            >
              <AuthInput
                id="c-email"
                value={formTemplate.data.email}
                onChange={(v) => formTemplate.setData('email', v.target.value)}
                onBlur={() => formTemplate.validateField('email')}
                placeholder="alice@techcorp.com"
                hasError={!!formTemplate.errors.email}
                disabled={loading || disabled}
                readOnly={!!user}
              />
            </FieldGroup>
          </div>

          {/* Mot de passe + générateur */}
          <FieldGroup
            label="Mot de passe temporaire"
            htmlFor="c-password"
            error={formTemplate.errors.password?.toLocaleString()}
          >
            <div className="flex gap-2">
              <div className="w-full">
                <PasswordInput
                  id="c-password"
                  name="c-password"
                  placeholder="••••••••"
                  autoComplete="password"
                  value={formTemplate.data.password}
                  onChange={(e) => formTemplate.setData('password', e.target.value)}
                  onBlur={() => formTemplate.validateField('password')}
                  hasError={!!formTemplate.errors.password}
                  disabled={loading || disabled}
                />
              </div>
              {/* Générer */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || disabled}
                title="Générer un nouveau mot de passe"
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors shrink-0"
              >
                <RefreshCircle1Clockwise size={18} />
              </button>
              {/* Copier */}
              <button
                type="button"
                onClick={handleCopy}
                disabled={loading || disabled}
                title="Copier"
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors shrink-0"
              >
                {copied ? <Check size={19} /> : <Copy4 size={19} />}
              </button>
            </div>
            {/* Barre de force */}
            <PasswordStrength password={formTemplate.data.password} />
          </FieldGroup>

          {/* Rôle */}
          <FieldGroup label="Rôle" htmlFor="c-role">
            <div className="flex gap-2">
              {availableRoles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  disabled={disabled}
                  className={cn(
                    'flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors',
                    role === r
                      ? r === 'ADMIN'
                        ? roleLabel.ADMIN.color
                        : roleLabel.CLIENT.color
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600'
                  )}
                >
                  {roleLabel[r].label}
                </button>
              ))}
            </div>
          </FieldGroup>

          {/* Séparateur */}
          <AuthDivider label="Accès aux serveurs" />

          {/* AccessPolicy */}
          <AccessPolicyEditor policy={policy} servers={servers} onChange={setPolicy} />
        </div>

        <div className="px-5">
          {/* Zone suppression */}
          {user && user.role !== 'CREATOR' && onRemoveProcess && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-red-100" />
                <span className="text-xs text-red-300 shrink-0">Danger</span>
                <div className="flex-1 h-px bg-red-100" />
              </div>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-2 rounded-xl border border-red-100 text-red-400 text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Supprimer ce compte
                </button>
              ) : (
                <div className="flex flex-col gap-2 px-3 py-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs text-red-700 font-medium">
                    Confirmer la suppression de <strong>{user?.username}</strong> ?
                  </p>
                  <p className="text-xs text-red-500">
                    Cette action est irréversible. L&apos;utilisateur sera notifié par email.
                  </p>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {deleteLoading && <Spinner size={'sm'} />}
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleteLoading}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          {!disabled && (
            <SubmitButton
              loading={loading}
              label={user ? 'Mettre à jour' : 'Créer le compte'}
              loadingLabel={user ? 'En cours' : 'Création...'}
            />
          )}
        </div>
      </form>
    </ModalOverlay>
  )
}
