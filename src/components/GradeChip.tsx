import type { Grade } from '../lib/score'

interface GradeChipProps {
  grade: Grade
  color: string
}

export function GradeChip({ grade, color }: GradeChipProps) {
  // Grade C uses dark amber glyph text; everything else uses near-black.
  const text = grade === 'C' ? '#3a2c00' : '#0d0d0d'
  return (
    <div
      className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-18 text-46 font-black"
      style={{ background: color, color: text }}
    >
      {grade}
    </div>
  )
}
