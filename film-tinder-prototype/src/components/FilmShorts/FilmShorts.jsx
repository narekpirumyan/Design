import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FiChevronLeft } from 'react-icons/fi'

// Get trailer video ID for each movie
const getTrailerVideoId = (movieTitle) => {
  const trailerIds = {
    'Inception': 'YoHD9XEInc0',
    'The Grand Budapest Hotel': '1Fg5iWmB5c0',
    'Parasite': '5xH0HfJHsaY',
    'Spirited Away': 'ByXuk9QqQkk',
    'Mad Max: Fury Road': 'hEJnMQG9ev8'
  }
  return trailerIds[movieTitle] || 'YoHD9XEInc0' // Default to Inception if not found
}

export function FilmShorts({ movie, onBack, onSwipe, onAddToWatchlist }) {
  const [currentShortIndex, setCurrentShortIndex] = useState(0)
  const containerRef = useRef(null)
  const videoRefs = useRef({})
  const [containerHeight, setContainerHeight] = useState(812) // Default phone height
  const y = useMotionValue(0)

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [])

  // Auto-play current video and pause others when index changes
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const iframe = videoRefs.current[key]
      if (iframe && iframe.contentWindow) {
        // YouTube iframes autoplay via URL parameters
        // The active one will autoplay, others won't be loaded
      }
    })
  }, [currentShortIndex])

  // Movie-specific shorts with actual short clips (not trailers) - Instagram Reels style
  const getMovieShorts = () => {
    // Using YouTube video IDs for short clips (behind the scenes, interviews, etc.) - NOT trailers
    const movieShorts = {
      'Inception': [
        { videoId: '66TuSJo4dZM', title: 'Behind the Scenes', startTime: 0 },
        { videoId: 'YoHD9XEInc0', title: 'Action Scenes Breakdown', startTime: 60 },
        { videoId: '66TuSJo4dZM', title: 'Visual Effects', startTime: 30 },
        { videoId: 'YoHD9XEInc0', title: 'Dream Sequences', startTime: 90 }
      ],
      'The Grand Budapest Hotel': [
        { videoId: '1Fg5iWmB5c0', title: 'Behind the Scenes', startTime: 45 },
        { videoId: '1Fg5iWmB5c0', title: 'Comedy Moments', startTime: 90 },
        { videoId: '1Fg5iWmB5c0', title: 'Stylish Scenes', startTime: 120 },
        { videoId: '1Fg5iWmB5c0', title: 'Character Highlights', startTime: 150 }
      ],
      'Parasite': [
        { videoId: '5xH0HfJHsaY', title: 'Behind the Scenes', startTime: 50 },
        { videoId: '5xH0HfJHsaY', title: 'Intense Moments', startTime: 100 },
        { videoId: '5xH0HfJHsaY', title: 'Social Commentary', startTime: 150 },
        { videoId: '5xH0HfJHsaY', title: 'Best Scenes', startTime: 200 }
      ],
      'Spirited Away': [
        { videoId: 'ByXuk9QqQkk', title: 'Behind the Scenes', startTime: 40 },
        { videoId: 'ByXuk9QqQkk', title: 'Magical Moments', startTime: 80 },
        { videoId: 'ByXuk9QqQkk', title: 'Beautiful Animation', startTime: 120 },
        { videoId: 'ByXuk9QqQkk', title: 'Character Scenes', startTime: 160 }
      ],
      'Mad Max: Fury Road': [
        { videoId: 'hEJnMQG9ev8', title: 'Behind the Scenes', startTime: 50 },
        { videoId: 'hEJnMQG9ev8', title: 'Action Sequences', startTime: 100 },
        { videoId: 'hEJnMQG9ev8', title: 'Chase Scenes', startTime: 150 },
        { videoId: 'hEJnMQG9ev8', title: 'Best Stunts', startTime: 200 }
      ]
    }

    // Default shorts if movie not found
    const defaultShorts = [
      { videoId: 'YoHD9XEInc0', title: 'Behind the Scenes', startTime: 30 },
      { videoId: 'YoHD9XEInc0', title: 'Action Scene', startTime: 60 },
      { videoId: 'YoHD9XEInc0', title: 'Best Moment', startTime: 90 },
      { videoId: 'YoHD9XEInc0', title: 'Short Extract', startTime: 120 }
    ]

    const clips = movieShorts[movie.title] || defaultShorts

    const shorts = clips.map((clip, index) => ({
      id: String(index + 1),
      title: clip.title,
      videoId: clip.videoId,
      startTime: clip.startTime,
      thumbnail: movie.poster,
      duration: '0:30',
      views: `${(Math.random() * 2 + 0.5).toFixed(1)}M`
    }))

    // Get trailer video ID
    const trailerVideoId = getTrailerVideoId(movie.title)
    
    // Check if the first item is the trailer (by videoId or title)
    const isFirstItemTrailer = shorts.length > 0 && (
      shorts[0].videoId === trailerVideoId || 
      shorts[0].title.toLowerCase().includes('trailer') ||
      shorts[0].title.toLowerCase() === movie.title.toLowerCase()
    )

    // If the first item is the trailer, move it to the end
    if (isFirstItemTrailer) {
      const trailer = shorts[0]
      const otherShorts = shorts.slice(1)
      return [...otherShorts, trailer]
    }

    // Also check if trailer exists elsewhere in the array and move it to the end
    const trailerIndex = shorts.findIndex((short, index) => 
      index > 0 && (short.videoId === trailerVideoId || short.title.toLowerCase().includes('trailer'))
    )

    if (trailerIndex !== -1) {
      const trailer = shorts[trailerIndex]
      const otherShorts = shorts.filter((_, index) => index !== trailerIndex)
      return [...otherShorts, trailer]
    }

    return shorts
  }

  const shorts = getMovieShorts()

  const currentShort = shorts[currentShortIndex]

  const handleDrag = (event, info) => {
    // Update position during drag
    y.set(info.offset.y)
  }

  const handleDragEnd = (event, info) => {
    const threshold = 50 // Lower threshold for more sensitive swipes
    const velocity = info.velocity.y

    if (Math.abs(info.offset.y) > threshold || Math.abs(velocity) > 300) {
      if (info.offset.y > 0 || velocity > 0) {
        // Swipe down - previous short
        setCurrentShortIndex((prev) => {
          const newIndex = (prev - 1 + shorts.length) % shorts.length
          return newIndex
        })
      } else {
        // Swipe up - next short
        setCurrentShortIndex((prev) => {
          const newIndex = (prev + 1) % shorts.length
          return newIndex
        })
      }
    }
    // Reset drag position
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
      <motion.div 
        ref={containerRef} 
        className="h-full relative overflow-hidden"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={(event) => {
          // Prevent text selection during drag
          if (event.target.tagName !== 'BUTTON') {
            event.preventDefault()
          }
        }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'pan-y',
          y: useTransform(y, (val) => val)
        }}
      >
        {shorts.map((short, index) => {
          const isActive = index === currentShortIndex
          const offset = index - currentShortIndex
          
          return (
            <motion.div
              key={short.id}
              style={{
                y: useTransform(y, (val) => {
                  const baseY = offset * containerHeight
                  return baseY + val
                }),
                zIndex: shorts.length - Math.abs(offset),
                userSelect: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'auto'
              }}
              className="absolute inset-0 w-full h-full"
              animate={{
                y: offset * containerHeight,
                scale: isActive ? 1 : 0.95,
                opacity: Math.abs(offset) <= 1 ? 1 : 0
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Video Player - Instagram Reels Style with YouTube Embed */}
              <div className="relative w-full h-full bg-black" style={{ overflow: 'hidden', userSelect: 'none', pointerEvents: isActive ? 'auto' : 'none' }}>
                {isActive ? (
                  <iframe
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el
                    }}
                    src={`https://www.youtube-nocookie.com/embed/${short.videoId}?autoplay=1&mute=1&loop=1&playlist=${short.videoId}&start=${short.startTime}&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3`}
                    className="absolute inset-0"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      pointerEvents: 'none' // Allow drag gestures to pass through
                    }}
                    frameBorder="0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={short.title}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={short.thumbnail}
                      alt={short.title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.5)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                )}
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
      </motion.div>

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

