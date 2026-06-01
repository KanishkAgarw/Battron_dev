import { useRef, useState, type ReactNode } from 'react'
import { ToastContext } from '../hooks/useToast'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const trigger = (m: string) => {
    setMsg(m)
    setShow(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setShow(false), 1800)
  }

  return (
    <ToastContext.Provider value={trigger}>
      {children}
      <div
        className={`pointer-events-none fixed bottom-[96px] left-1/2 z-[60] -translate-x-1/2 rounded-10 bg-battron-black px-[16px] py-[10px] text-13 text-white transition-opacity duration-[250ms] ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {msg}
      </div>
    </ToastContext.Provider>
  )
}
