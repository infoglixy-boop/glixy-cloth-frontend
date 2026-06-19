import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'

export default function Toast() {
  const { toast } = useStore()
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-brand-ink text-white text-sm font-medium px-5 py-3 rounded-full shadow-cardHover"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
