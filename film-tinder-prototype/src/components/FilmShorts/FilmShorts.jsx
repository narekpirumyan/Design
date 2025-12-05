import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FiChevronLeft } from 'react-icons/fi'

export function FilmShorts({ movie, onBack, onSwipe, onAddToWatchlist }) {
  const [currentShortIndex, setCurrentShortIndex] = useState(0)
  const containerRef = useRef(null)
  const [containerHeight, setContainerHeight] = useState(812) // Default phone height
  const y = useMotionValue(0)

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [])

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

  const handleDragEnd = (event, info) => {
    const threshold = 100
    const velocity = info.velocity.y

    if (Math.abs(info.offset.y) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.y > 0 || velocity > 0) {
        // Swipe down - previous short
        setCurrentShortIndex((prev) => (prev - 1 + shorts.length) % shorts.length)
      } else {
        // Swipe up - next short
        setCurrentShortIndex((prev) => (prev + 1) % shorts.length)
      }
    }
    y.set(0)
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

      {/* Shorts Container - Vertical Scrollable */}
      <div ref={containerRef} className="h-full relative overflow-hidden">
        {shorts.map((short, index) => {
          const isActive = index === currentShortIndex
          const offset = index - currentShortIndex
          
          return (
            <motion.div
              key={short.id}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
              onDrag={(event, info) => {
                if (isActive) {
                  y.set(info.offset.y)
                }
              }}
              onDragEnd={handleDragEnd}
              style={{
                y: useTransform(y, (val) => {
                  const baseY = offset * containerHeight
                  return isActive ? baseY + val : baseY
                }),
                zIndex: shorts.length - Math.abs(offset)
              }}
              className="absolute inset-0 w-full h-full"
              animate={{
                y: offset * containerHeight,
                scale: isActive ? 1 : 0.95,
                opacity: Math.abs(offset) <= 1 ? 1 : 0
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Video Thumbnail/Placeholder */}
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <img
                  src={short.thumbnail}
                  alt={short.title}
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
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pb-20">
                <h3 className="text-white font-bold text-xl mb-2">{short.title}</h3>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span>{short.duration}</span>
                  <span>•</span>
                  <span>{short.views} views</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Shorts Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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

