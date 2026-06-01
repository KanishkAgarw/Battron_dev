import { useJobCard } from '../state/JobCardContext'
import { Chip } from './Chip'

type ChipGroupKey = 'complaints' | 'visual' | 'actions'

interface ChipGroupProps {
  group: ChipGroupKey
  items: string[]
  warnItems?: string[]
  className?: string
}

export function ChipGroup({ group, items, warnItems, className = '' }: ChipGroupProps) {
  const { data, toggleChip } = useJobCard()
  const selected = data[group]
  return (
    <div className={`flex flex-wrap gap-[8px] ${className}`}>
      {items.map((label) => (
        <Chip
          key={label}
          label={label}
          on={selected.indexOf(label) >= 0}
          warn={warnItems ? warnItems.indexOf(label) >= 0 : false}
          onToggle={() => toggleChip(group, label)}
        />
      ))}
    </div>
  )
}
