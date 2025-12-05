import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiHeart, FiXCircle } from 'react-icons/fi'

export function FilmShorts({ movie, onBack, onSwipe, onAddToWatchlist }) {
  const [currentShortIndex, setCurrentShortIndex] = useState(0)

  // Mock shorts data
  const shorts = [
    {
      id: '1',
      title: 'Behind the Scenes: Dream Sequences',
      thumbnail: movie.poster,
      duration: '2:34',
      views: '1.2M'
    },
    {
      id: '2',
      title: 'Cast Interviews',
      thumbnail: movie.poster,
      duration: '4:12',
      views: '856K'
    },
    {
      id: '3',
      title: 'Visual Effects Breakdown',
      thumbnail: movie.poster,
      duration: '3:45',
      views: '2.1M'
    },
    {
      id: '4',
      title: 'Director\'s Commentary',
      thumbnail: movie.poster,
      duration: '5:20',
      views: '623K'
    }
  ]

  const currentShort = shorts[currentShortIndex]

  const handleNext = () => {
    setCurrentShortIndex((prev) => (prev + 1) % shorts.length)
  }

  const handlePrev = () => {
    setCurrentShortIndex((prev) => (prev - 1 + shorts.length) % shorts.length)
  }

  return (
    <div className="h-full bg-black overflow-hidden relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>

      {/* Short Video Area */}
      <div className="h-full flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentShortIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            {/* Video Thumbnail/Placeholder */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <img
                src={currentShort.thumbnail}
                alt={currentShort.title}
                className="w-full h-full object-cover opacity-50"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>

            {/* Short Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              <h3 className="text-white font-bold text-xl mb-2">{currentShort.title}</h3>
              <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                <span>{currentShort.duration}</span>
                <span>•</span>
                <span>{currentShort.views} views</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center gap-6 px-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onSwipe('left', movie.id)}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all border-2 border-white/30"
        >
          <FiXCircle className="w-8 h-8 text-white" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddToWatchlist(movie.id)}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Add to Watchlist
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onSwipe('right', movie.id)}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all border-2 border-white/30"
        >
          <FiHeart className="w-8 h-8 text-white" />
        </motion.button>
      </div>

      {/* Shorts Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {shorts.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === currentShortIndex ? 'w-8 bg-white' : 'w-1 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

