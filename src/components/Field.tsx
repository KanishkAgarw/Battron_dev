import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor?: string
  full?: boolean
  children: ReactNode
}

/** label + control slot. `full` spans both grid columns (.f.full). */
export function Field({ label, htmlFor, full, children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-[5px] ${full ? 'col-span-full' : ''}`}>
      <label htmlFor={htmlFor} className="text-12 font-semibold text-battron-slate">
        {label}
      </label>
      {children}
    </div>
  )
}
