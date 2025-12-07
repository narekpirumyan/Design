import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FiChevronLeft, FiPlay, FiPause } from 'react-icons/fi'

export function FilmShorts({ movie, onBack, onSwipe, onAddToWatchlist }) {
  const [currentShortIndex, setCurrentShortIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const containerRef = useRef(null)
  const videoRefs = useRef({})
  const [containerHeight, setContainerHeight] = useState(812) // Default phone height
  const y = useMotionValue(0)

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [])

  // YouTube iframes autoplay via URL parameters, no need for manual play/pause
  // The iframe src already includes autoplay=1 for active videos

  // Movie-specific shorts with real movie trailer clips - Instagram Reels style
  const getMovieShorts = () => {
    // Using YouTube video IDs for actual movie trailers/clips
    // These are real movie trailers that can be embedded
    const movieClips = {
      'Inception': [
        { videoId: 'YoHD9XEInc0', title: 'Official Trailer', startTime: 0 },
        { videoId: 'YoHD9XEInc0', title: 'Action Scenes', startTime: 45 },
        { videoId: 'YoHD9XEInc0', title: 'Dream Sequences', startTime: 90 },
        { videoId: 'YoHD9XEInc0', title: 'Best Moments', startTime: 120 }
      ],
      'The Grand Budapest Hotel': [
        { videoId: '1Fg5iWmB5c0', title: 'Official Trailer', startTime: 0 },
        { videoId: '1Fg5iWmB5c0', title: 'Comedy Moments', startTime: 30 },
        { videoId: '1Fg5iWmB5c0', title: 'Stylish Scenes', startTime: 60 },
        { videoId: '1Fg5iWmB5c0', title: 'Character Highlights', startTime: 90 }
      ],
      'Parasite': [
        { videoId: '5xH0HfJHsaY', title: 'Official Trailer', startTime: 0 },
        { videoId: '5xH0HfJHsaY', title: 'Intense Moments', startTime: 40 },
        { videoId: '5xH0HfJHsaY', title: 'Social Commentary', startTime: 80 },
        { videoId: '5xH0HfJHsaY', title: 'Best Scenes', startTime: 120 }
      ],
      'Spirited Away': [
        { videoId: 'ByXuk9QqQkk', title: 'Official Trailer', startTime: 0 },
        { videoId: 'ByXuk9QqQkk', title: 'Magical Moments', startTime: 30 },
        { videoId: 'ByXuk9QqQkk', title: 'Beautiful Animation', startTime: 60 },
        { videoId: 'ByXuk9QqQkk', title: 'Character Scenes', startTime: 90 }
      ],
      'Mad Max: Fury Road': [
        { videoId: 'hEJnMQG9ev8', title: 'Official Trailer', startTime: 0 },
        { videoId: 'hEJnMQG9ev8', title: 'Action Sequences', startTime: 30 },
        { videoId: 'hEJnMQG9ev8', title: 'Chase Scenes', startTime: 60 },
        { videoId: 'hEJnMQG9ev8', title: 'Best Stunts', startTime: 90 }
      ]
    }

    // Default clips if movie not found
    const defaultClips = [
      { videoId: 'YoHD9XEInc0', title: 'Movie Clip', startTime: 0 },
      { videoId: 'YoHD9XEInc0', title: 'Action Scene', startTime: 30 },
      { videoId: 'YoHD9XEInc0', title: 'Best Moment', startTime: 60 },
      { videoId: 'YoHD9XEInc0', title: 'Trailer Extract', startTime: 90 }
    ]

    const clips = movieClips[movie.title] || defaultClips

    return clips.map((clip, index) => ({
      id: String(index + 1),
      title: clip.title,
      videoId: clip.videoId,
      startTime: clip.startTime,
      thumbnail: movie.poster,
      duration: '0:30',
      views: `${(Math.random() * 2 + 0.5).toFixed(1)}M`
    }))
  }

  const shorts = getMovieShorts()

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

  const togglePlayPause = () => {
    const iframe = videoRefs.current[currentShortIndex]
    if (iframe && iframe.contentWindow) {
      // YouTube iframe API would be needed for play/pause
      // For now, just toggle the playing state
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoRef = (index, element) => {
    if (element) {
      videoRefs.current[index] = element
      // YouTube iframe will autoplay via URL parameters
    }
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
              {/* Video Player - Instagram Reels Style with YouTube Embed */}
              <div className="relative w-full h-full bg-black" style={{ overflow: 'hidden' }}>
                {isActive ? (
                  <iframe
                    ref={(el) => handleVideoRef(index, el)}
                    src={`https://www.youtube-nocookie.com/embed/${short.videoId}?autoplay=1&mute=1&loop=1&playlist=${short.videoId}&start=${short.startTime}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                    className="absolute inset-0"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
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
                
                {/* Play/Pause Overlay */}
                {!isPlaying && index === currentShortIndex && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlayPause}
                  >
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <FiPlay className="w-10 h-10 text-white ml-1" />
                    </div>
                  </div>
                )}
                
                {/* Pause Button (when playing) */}
                {isPlaying && index === currentShortIndex && (
                  <button
                    onClick={togglePlayPause}
                    className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FiPause className="w-10 h-10 text-white" />
                    </div>
                  </button>
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

