import { motion } from 'framer-motion'
import { MovieCard } from '../MovieCard/MovieCard'
import { FiBookmark, FiMessageCircle } from 'react-icons/fi'

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
  const handleSave = () => {
    // Open group selection screen (same as swiping right)
    onSave?.(movie)
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
        opacity: isVisible ? 1 : 0
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
      <div className="absolute bottom-20 right-4 flex flex-col gap-4 z-20" data-tutorial-target="scroll-actions">
        {/* Save Button (Instagram bookmark style) */}
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <FiBookmark className="w-6 h-6 text-white" />
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

    </motion.div>
  )
}

