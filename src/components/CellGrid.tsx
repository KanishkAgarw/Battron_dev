interface CellGridProps {
  values: string[]
  onChange: (index: number, value: string) => void
  visible: boolean
}

/** Per-cell voltage grid (.cellgrid). Auto-fill columns min 66px. */
export function CellGrid({ values, onChange, visible }: CellGridProps) {
  return (
    <div
      className="mt-[8px] gap-[6px] grid-cols-[repeat(auto-fill,minmax(66px,1fr))]"
      style={{ display: visible ? 'grid' : 'none' }}
    >
      {values.map((v, i) => (
        <input
          key={i}
          value={v}
          placeholder={'C' + (i + 1)}
          inputMode="decimal"
          onChange={(e) => onChange(i, e.target.value)}
          className="w-full rounded-10 border border-battron-line bg-battron-inputBg p-[7px] text-center text-13 text-[#1c1c1c] focus:outline focus:outline-2 focus:outline-battron-green focus:border-battron-green"
        />
      ))}
    </div>
  )
}
