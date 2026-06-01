import type { Part } from '../lib/types'

interface PartRowProps {
  part: Part
  onChange: (key: keyof Part, value: string) => void
}

const CELL =
  'block w-full text-15 px-[11px] py-[10px] rounded-10 border border-battron-line bg-battron-inputBg text-[#1c1c1c] focus:outline focus:outline-2 focus:outline-battron-green focus:border-battron-green'

/** Single parts row (.partrow): columns 1.4fr 1fr .6fr 1fr. */
export function PartRow({ part, onChange }: PartRowProps) {
  return (
    <div className="mb-[6px] grid grid-cols-[1.4fr_1fr_0.6fr_1fr] gap-[6px]">
      <input
        className={CELL}
        placeholder="Brand/model"
        value={part.b}
        onChange={(e) => onChange('b', e.target.value)}
      />
      <input
        className={CELL}
        placeholder="Spec"
        value={part.s}
        onChange={(e) => onChange('s', e.target.value)}
      />
      <input
        className={CELL}
        placeholder="Qty"
        inputMode="numeric"
        value={part.q}
        onChange={(e) => onChange('q', e.target.value)}
      />
      <input
        className={CELL}
        placeholder="Position / remarks"
        value={part.p}
        onChange={(e) => onChange('p', e.target.value)}
      />
    </div>
  )
}
