import { useJobCard } from '../state/JobCardContext'
import { useToast } from '../hooks/useToast'

interface ActionBarProps {
  onScore: () => void
}

const BTN = 'flex-1 rounded-11 px-[8px] py-[13px] text-14 font-extrabold'
const SECONDARY = `${BTN} bg-battron-readonlyBg text-battron-btnSText hover:bg-[#e2ebd2]`
const DARK = `${BTN} bg-battron-black text-white hover:bg-battron-ink`
const PRIMARY = `${BTN} bg-battron-green text-battron-black hover:brightness-95`

export function ActionBar({ onScore }: ActionBarProps) {
  const { saveJob, newCard, share } = useJobCard()
  const toast = useToast()

  return (
    <div className="action-bar fixed bottom-0 left-0 right-0 z-40 border-t border-battron-line bg-white px-[12px] pt-[10px] pb-[max(10px,env(safe-area-inset-bottom))] shadow-bar">
      <div className="mx-auto flex max-w-container gap-[8px]">
        <button type="button" className={SECONDARY} onClick={() => newCard()}>
          ＋ New
        </button>
        <button
          type="button"
          className={SECONDARY}
          onClick={() => {
            const total = saveJob()
            toast(`Job saved (${total} total)`)
          }}
        >
          Save
        </button>
        <button type="button" className={DARK} onClick={share}>
          Share
        </button>
        <button type="button" className={PRIMARY} onClick={onScore}>
          Battron Score
        </button>
      </div>
    </div>
  )
}
