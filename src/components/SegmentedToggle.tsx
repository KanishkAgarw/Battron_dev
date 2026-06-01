interface SegmentedOption {
  label: string
  value: string
}

interface SegmentedToggleProps {
  value: string
  options: SegmentedOption[]
  onChange: (value: string) => void
  visible?: boolean
}

/** ".seg" inline segmented control. */
export function SegmentedToggle({
  value,
  options,
  onChange,
  visible = true,
}: SegmentedToggleProps) {
  return (
    <div
      className="seg-toggle mt-[4px] overflow-hidden rounded-9 border border-battron-line"
      style={{ display: visible ? 'inline-flex' : 'none' }}
    >
      {options.map((opt) => {
        const on = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`border-0 px-[16px] py-[7px] text-13 font-bold ${
              on
                ? 'bg-battron-green text-battron-black'
                : 'bg-battron-inputBg text-battron-readonlyText hover:bg-[#f0f4e6]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
