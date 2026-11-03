import { createContext, useContext } from 'react'

export interface ExpertPrefill {
  server?: string
  audience?: 'B2B' | 'B2C'
  note?: string
}

export const ExpertCtx = createContext<(p?: ExpertPrefill) => void>(() => {})

export const useExpert = () => useContext(ExpertCtx)
