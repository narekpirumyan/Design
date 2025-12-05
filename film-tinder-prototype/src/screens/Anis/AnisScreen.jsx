import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { motion } from 'framer-motion'

export function AnisScreen() {
  return (
    <PhoneFrame>
      <div className="h-full bg-white overflow-y-auto pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-gray-900">ANIS</h1>
        </motion.div>
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

