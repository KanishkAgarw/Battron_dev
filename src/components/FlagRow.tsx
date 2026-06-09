import type { FlagColor } from '../lib/api/types'

interface FlagRowProps {
  color: FlagColor
  children: string
}

const COLORS: Record<FlagColor, string> = {
  ok: 'bg-battron-flagOkBg text-battron-flagOkText',
  warn: 'bg-battron-flagWarnBg text-battron-flagWarnText',
  bad: 'bg-battron-flagBadBg text-battron-flagBadText',
}

export function FlagRow({ color, children }: FlagRowProps) {
  return (
    <div
      className={`mx-[16px] mb-[12px] rounded-10 px-[16px] py-[10px] text-14 font-bold ${COLORS[color]}`}
    >
      {children}
    </div>
  )
}
