interface SelectInputProps {
  id?: string
  value: string
  onChange: (v: string) => void
  options: string[]
  className?: string
}

/**
 * In the original CSS, <select> always carries the green outline + border
 * (rule `select,input:focus,textarea:focus{...}`), not just on focus.
 */
const BASE =
  'block w-full text-15 px-[11px] py-[10px] rounded-10 bg-battron-inputBg text-[#1c1c1c] border border-battron-green outline outline-2 outline-battron-green'

export function SelectInput({
  id,
  value,
  onChange,
  options,
  className = '',
}: SelectInputProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${BASE} ${className}`}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
