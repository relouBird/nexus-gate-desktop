import { Field } from '../auth/AuthFormparts'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: React.ReactNode
}

export function SectionCard({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="bg-white border w-full border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  )
}

export function FieldGroup({
  label,
  htmlFor,
  error,
  children,
  hint
}: FieldProps): React.JSX.Element {
  return (
    <Field label={label} htmlFor={htmlFor} error={error} small>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </Field>
  )
}
