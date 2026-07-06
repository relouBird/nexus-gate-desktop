import { useState, useEffect } from 'react'

/** Hook pour détecter mobile (< 480px) côté React */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 480 : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 479px)')
    const handler = (e: MediaQueryListEvent): void => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}
