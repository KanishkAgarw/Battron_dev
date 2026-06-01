interface TextAreaProps {
  id?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

const BASE =
  'block w-full text-15 px-[11px] py-[10px] rounded-10 border border-battron-line bg-battron-inputBg text-[#1c1c1c] min-h-[60px] resize-y focus:outline focus:outline-2 focus:outline-battron-green focus:border-battron-green'

export function TextArea({ id, value, onChange, placeholder }: TextAreaProps) {
  return (
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={BASE}
    />
  )
}
