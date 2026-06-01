import { useState, type ReactNode } from 'react'

interface SectionProps {
  number: number
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Section({ number, title, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="my-[10px] overflow-hidden rounded-14 border border-battron-line bg-battron-card shadow-card"
    >
      <summary
        className={`flex cursor-pointer select-none items-center gap-[10px] px-[16px] py-[14px] text-15 font-bold text-battron-summary ${
          open ? 'border-b border-battron-line' : ''
        }`}
      >
        <span className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-7 bg-battron-green text-12 font-extrabold text-battron-black">
          {number}
        </span>
        {title}
        <span
          className={`chevron ml-auto text-13 text-battron-greenDark transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          }`}
        >
          ›
        </span>
      </summary>
      <div className="section-body px-[16px] py-[14px]">{children}</div>
    </details>
  )
}
