interface TimeFieldProps {
  id: string
  value: string
  onChange: (v: string) => void
  onNow: () => void
}

/** datetime-local input + "Now" button (.timerow). */
export function TimeField({ id, value, onChange, onNow }: TimeFieldProps) {
  return (
    <div className="flex items-stretch gap-[6px]">
      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block flex-1 text-15 px-[11px] py-[10px] rounded-10 border border-battron-line bg-battron-inputBg text-[#1c1c1c] focus:outline focus:outline-2 focus:outline-battron-green focus:border-battron-green"
      />
      <button
        type="button"
        onClick={onNow}
        className="now-btn whitespace-nowrap rounded-8 border border-battron-greenDark bg-battron-readonlyBg px-[10px] py-0 text-12 font-bold text-battron-greenDark hover:bg-[#e2ebd2]"
      >
        Now
      </button>
    </div>
  )
}
