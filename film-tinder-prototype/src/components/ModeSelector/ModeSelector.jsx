import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { FiFilm, FiInfo, FiVideo } from 'react-icons/fi'

const modes = [
  { id: 'swipe', icon: FiFilm, label: 'Swipe', color: 'from-pink-500 to-red-500' },
  { id: 'details', icon: FiInfo, label: 'Details', color: 'from-blue-500 to-cyan-500' },
  { id: 'shorts', icon: FiVideo, label: 'Shorts', color: 'from-purple-500 to-pink-500' }
]

export function ModeSelector({ currentMode, onModeChange, isVisible }) {
  const [rotation, setRotation] = useState(0)
  const dragX = useMotionValue(0)
  const dragOffset = useTransform(dragX, [-200, 200], [-30, 30])
  
  // Reset rotation when mode changes externally
  useEffect(() => {
    setRotation(0)
    dragX.set(0)
  }, [currentMode, dragX])
  
  if (!isVisible) return null

  const currentModeIndex = modes.findIndex(m => m.id === currentMode)
  const baseRotation = -currentModeIndex * 120 // 120 degrees per face (360/3)
  const totalRotation = baseRotation + rotation

  const handleClose = () => {
    // Close by keeping current mode
    onModeChange(currentMode)
    setRotation(0)
    dragX.set(0)
  }

  const handleDragEnd = (event, info) => {
    const threshold = 50
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 300) {
      const direction = info.offset.x > 0 ? -1 : 1 // Invert for natural rotation
      const newRotation = rotation + (direction * 120)
      
      // Calculate which mode should be active based on rotation
      const totalRot = baseRotation + newRotation
      const normalizedRot = ((totalRot % 360) + 360) % 360
      const newModeIndex = Math.round(normalizedRot / 120) % 3
      const newMode = modes[newModeIndex]
      
      if (newMode.id !== currentMode) {
        onModeChange(newMode.id)
        // Reset rotation after mode change
        setRotation(0)
      } else {
        // If same mode, just reset rotation
        setRotation(0)
      }
    } else {
      // If drag wasn't enough, reset rotation
      setRotation(0)
    }
    dragX.set(0)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 z-[60] flex flex-col"
        onClick={handleClose}
      >
        {/* Keep bottom navigation visible */}
        <div className="flex-1 flex items-center justify-center relative" style={{ perspective: '1200px' }}>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Cylinder Container */}
            <motion.div
              initial={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDrag={(event, info) => {
                dragX.set(info.offset.x)
              }}
              onDragEnd={handleDragEnd}
              className="relative cursor-grab active:cursor-grabbing"
              style={{
                width: '375px',
                height: '600px',
                transformStyle: 'preserve-3d',
                scale: 0.6,
                rotateY: useTransform(dragOffset, (val) => totalRotation + val)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Create 3 faces of the cylinder */}
              {modes.map((mode, index) => {
                const Icon = mode.icon
                const faceRotation = index * 120 // 120 degrees per face
                const isActive = mode.id === currentMode
                
                return (
                  <motion.div
                    key={mode.id}
                    className="absolute w-full h-full cursor-pointer"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${faceRotation}deg) translateZ(150px)`,
                      backfaceVisibility: 'hidden'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onModeChange(mode.id)
                      setRotation(0)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${mode.color} p-8 flex flex-col items-center justify-center gap-6 shadow-2xl border-4 ${isActive ? 'border-white' : 'border-white/30'}`}>
                      <div className={`w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ${isActive ? 'scale-110' : ''} transition-transform`}>
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <span className="text-white font-bold text-2xl">{mode.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full bg-white"
                        />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Instructions */}
        <div className="pb-20 px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center text-sm"
          >
            Tap a mode to select • Swipe left/right to rotate
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
