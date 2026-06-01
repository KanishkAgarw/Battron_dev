type InputMode =
  | 'text'
  | 'numeric'
  | 'decimal'
  | 'tel'
  | 'email'
  | 'url'
  | 'search'
  | 'none'

interface TextInputProps {
  id?: string
  value: string
  onChange?: (v: string) => void
  type?: 'text' | 'number' | 'tel' | 'date' | 'datetime-local'
  placeholder?: string
  inputMode?: InputMode
  readOnly?: boolean
  className?: string
}

const BASE =
  'block w-full text-15 px-[11px] py-[10px] rounded-10 border border-battron-line bg-battron-inputBg text-[#1c1c1c] focus:outline focus:outline-2 focus:outline-battron-green focus:border-battron-green read-only:bg-battron-readonlyBg read-only:text-battron-readonlyText read-only:font-bold'

export function TextInput({
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  inputMode,
  readOnly,
  className = '',
}: TextInputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      inputMode={inputMode}
      readOnly={readOnly}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className={`${BASE} ${className}`}
    />
  )
}
