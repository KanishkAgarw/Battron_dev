interface SubHeaderProps {
  children: string
  first?: boolean
}

/** ".sub" green-square heading. `first` removes the top margin (.sub:first-child). */
export function SubHeader({ children, first }: SubHeaderProps) {
  return (
    <div
      className={`flex items-center gap-[8px] ${
        first ? 'mt-0' : 'mt-[16px]'
      } mb-[8px] text-12 font-extrabold uppercase tracking-[1px] text-battron-greenDark`}
    >
      <span className="h-[8px] w-[8px] flex-none rounded-[2px] bg-battron-green" />
      {children}
    </div>
  )
}
