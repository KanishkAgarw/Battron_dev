import { useJobCard } from '../state/JobCardContext'
import { Logo } from './Logo'

export function Header() {
  const { jobNoTop, done } = useJobCard()
  return (
    <header className="sticky top-0 z-30 flex items-center gap-[10px] bg-battron-black px-[14px] py-[10px] text-white shadow-header">
      <Logo />
      <span className="text-14 font-bold">Battery Job Card</span>
      <span className="flex-1" />
      <span className="text-right text-11 font-bold leading-[1.2] text-battron-greenBright">
        {jobNoTop}
        <br />
        <span
          className={`font-semibold ${done ? 'text-battron-green' : 'text-battron-muted'}`}
        >
          {done ? 'Done' : 'Draft'}
        </span>
      </span>
    </header>
  )
}
