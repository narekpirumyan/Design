import { motion, AnimatePresence } from 'framer-motion'
import { MovieCard } from '../MovieCard/MovieCard'
import { FiHeart, FiX, FiInfo } from 'react-icons/fi'
import { useState } from 'react'

export function ScrollableCard({ 
  movie, 
  onLike, 
  onPass,
  onInfo,
  index = 0,
  isVisible = true
}) {
  const [isLiked, setIsLiked] = useState(false)
  const [isPassed, setIsPassed] = useState(false)

  const handleLike = () => {
    setIsLiked(true)
    setTimeout(() => {
      onLike?.(movie.id)
    }, 300)
  }

  const handlePass = () => {
    setIsPassed(true)
    setTimeout(() => {
      onPass?.(movie.id)
    }, 300)
  }

  if (!movie) {
    return null
  }

  return (
    <motion.div
      className="relative w-full h-full flex-shrink-0"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.3,
        scale: isLiked ? 1.05 : isPassed ? 0.95 : 1
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="w-full h-full">
        <MovieCard movie={movie} />
      </div>
      
      {/* Action Buttons - Bottom Right */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-4 z-20">
        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <FiHeart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </motion.button>

        {/* Pass Button */}
        <motion.button
          onClick={handlePass}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <FiX className={`w-6 h-6 ${isPassed ? 'text-gray-400' : 'text-white'}`} />
        </motion.button>

        {/* Info Button */}
        <motion.button
          onClick={() => onInfo?.(movie.id)}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <FiInfo className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Like/Pass Feedback Overlay */}
      <AnimatePresence>
        {isLiked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <motion.div
              initial={{ rotate: -15 }}
              animate={{ rotate: 15 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.2 }}
              className="text-6xl"
            >
              ❤️
            </motion.div>
          </motion.div>
        )}
        {isPassed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <motion.div className="text-6xl">
              👋
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

