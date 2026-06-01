import { useJobCard } from '../state/JobCardContext'
import { PartRow } from './PartRow'

export function PartsRepeater() {
  const { data, updatePart, addPart } = useJobCard()
  return (
    <div>
      <div>
        {data.parts.map((part, i) => (
          <PartRow key={i} part={part} onChange={(key, value) => updatePart(i, key, value)} />
        ))}
      </div>
      <button
        type="button"
        onClick={addPart}
        className="add-btn w-full rounded-10 border border-dashed border-battron-greenDark bg-battron-readonlyBg py-[9px] font-bold text-battron-greenDark hover:bg-[#e2ebd2] hover:text-battron-greenDeep"
      >
        + Add part / cell
      </button>
    </div>
  )
}
