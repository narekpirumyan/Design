import { motion, AnimatePresence } from 'framer-motion'
import { MovieCard } from '../MovieCard/MovieCard'
import { FiBookmark, FiMessageCircle } from 'react-icons/fi'
import { useState } from 'react'

export function ScrollableCard({ 
  movie, 
  onLike, 
  onPass,
  onInfo,
  onComment,
  onSave,
  index = 0,
  isVisible = true
}) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    const newSavedState = !isSaved
    setIsSaved(newSavedState)
    // Save functionality - only trigger onSave callback (not onLike which advances the movie)
    if (newSavedState) {
      onSave?.(movie)
    }
  }

  const handleComment = () => {
    // Open comment modal
    onComment?.(movie)
  }

  if (!movie) {
    return null
  }

  return (
    <motion.div
      className="relative w-full h-full flex-shrink-0"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isSaved ? 1.05 : 1
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ 
        pointerEvents: isVisible ? 'auto' : 'none',
        display: isVisible ? 'block' : 'none'
      }}
    >
      <div className="w-full h-full">
        <MovieCard movie={movie} variant="scroll" />
      </div>
      
      {/* Action Buttons - Bottom Right (Instagram style) */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-4 z-20">
        {/* Save Button (Instagram bookmark style) */}
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <FiBookmark className={`w-6 h-6 ${isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
        </motion.button>

        {/* Comment Button */}
        <motion.button
          onClick={handleComment}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <FiMessageCircle className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Save Feedback Overlay */}
      <AnimatePresence>
        {isSaved && (
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
              💾
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

