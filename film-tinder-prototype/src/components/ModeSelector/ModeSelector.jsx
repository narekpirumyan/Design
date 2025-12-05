import { motion, AnimatePresence } from 'framer-motion'
import { FiFilm, FiInfo, FiVideo } from 'react-icons/fi'

const modes = [
  { id: 'swipe', icon: FiFilm, label: 'Swipe', color: 'from-pink-500 to-red-500' },
  { id: 'details', icon: FiInfo, label: 'Details', color: 'from-blue-500 to-cyan-500' },
  { id: 'shorts', icon: FiVideo, label: 'Shorts', color: 'from-purple-500 to-pink-500' }
]

export function ModeSelector({ currentMode, onModeChange, isVisible }) {
  if (!isVisible) return null

  const handleClose = () => {
    // Close by keeping current mode
    onModeChange(currentMode)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {/* Cylinder Container */}
          <div className="relative w-64 h-80" style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              {modes.map((mode, index) => {
                const Icon = mode.icon
                const isActive = mode.id === currentMode
                const rotation = (index * 120) % 360 // 3 modes, 120 degrees each
                const zOffset = isActive ? 50 : 0
                
                return (
                  <motion.div
                    key={mode.id}
                    initial={{ rotateY: rotation, z: zOffset }}
                    animate={{ 
                      rotateY: rotation,
                      z: isActive ? 50 : 0,
                      scale: isActive ? 1.1 : 0.9
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute w-full h-full cursor-pointer"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden'
                    }}
                    onClick={() => onModeChange(mode.id)}
                  >
                    <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${mode.color} p-6 flex flex-col items-center justify-center gap-4 shadow-2xl border-4 ${isActive ? 'border-white' : 'border-white/30'}`}>
                      <div className={`w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ${isActive ? 'scale-110' : ''}`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <span className="text-white font-bold text-lg">{mode.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-white"
                        />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Instructions */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center mt-8 text-sm"
          >
            Tap a mode to select
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
