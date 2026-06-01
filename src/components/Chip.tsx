interface ChipProps {
  label: string
  on: boolean
  warn?: boolean
  onToggle: () => void
}

export function Chip({ label, on, warn, onToggle }: ChipProps) {
  let cls =
    'cursor-pointer rounded-pill border px-[13px] py-[8px] text-13 font-semibold focus:outline focus:outline-2 focus:outline-battron-green '
  if (warn && on) {
    cls +=
      'border-battron-red bg-battron-chipWarnBg text-battron-chipWarnText hover:brightness-95'
  } else if (on) {
    cls += 'border-battron-greenDark bg-battron-green text-battron-black hover:brightness-95'
  } else {
    cls +=
      'border-battron-line bg-battron-inputBg text-battron-readonlyText hover:bg-[#f0f4e6]'
  }
  return (
    <button type="button" onClick={onToggle} className={cls}>
      {label}
    </button>
  )
}
