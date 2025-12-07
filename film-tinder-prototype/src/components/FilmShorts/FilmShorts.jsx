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

  // Auto-play current video and pause others when index changes
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key]
      if (video) {
        if (parseInt(key) === currentShortIndex && isPlaying) {
          video.play().catch(() => {
            // Autoplay might be blocked, handle gracefully
            setIsPlaying(false)
          })
        } else {
          video.pause()
        }
      }
    })
  }, [currentShortIndex, isPlaying])

  // Movie-specific shorts with GIFs from Giphy - Instagram Reels style
  const getMovieShorts = () => {
    // Using actual Giphy video URLs (MP4 format) for movie-related GIFs
    // These are popular movie GIFs that auto-play like Instagram Reels
    const movieGifs = {
      'Inception': [
        'https://media.giphy.com/media/3o7aCTPPb4OHbRLhv6/giphy.mp4',
        'https://media.giphy.com/media/3o7abldur0Y0jQj3R6/giphy.mp4',
        'https://media.giphy.com/media/3o7abnDuVuJc4D4W6E/giphy.mp4',
        'https://media.giphy.com/media/l0MYC0LajboID0xBu/giphy.mp4'
      ],
      'The Grand Budapest Hotel': [
        'https://media.giphy.com/media/3o7abldur0Y0jQj3R6/giphy.mp4',
        'https://media.giphy.com/media/3o7abnDuVuJc4D4W6E/giphy.mp4',
        'https://media.giphy.com/media/3o7aCTPPb4OHbRLhv6/giphy.mp4',
        'https://media.giphy.com/media/l0MYC0LajboID0xBu/giphy.mp4'
      ],
      'Parasite': [
        'https://media.giphy.com/media/3o7abnDuVuJc4D4W6E/giphy.mp4',
        'https://media.giphy.com/media/3o7aCTPPb4OHbRLhv6/giphy.mp4',
        'https://media.giphy.com/media/3o7abldur0Y0jQj3R6/giphy.mp4',
        'https://media.giphy.com/media/l0MYC0LajboID0xBu/giphy.mp4'
      ],
      'Spirited Away': [
        'https://media.giphy.com/media/3o7abldur0Y0jQj3R6/giphy.mp4',
        'https://media.giphy.com/media/3o7abnDuVuJc4D4W6E/giphy.mp4',
        'https://media.giphy.com/media/3o7aCTPPb4OHbRLhv6/giphy.mp4',
        'https://media.giphy.com/media/l0MYC0LajboID0xBu/giphy.mp4'
      ],
      'Mad Max: Fury Road': [
        'https://media.giphy.com/media/3o7aCTPPb4OHbRLhv6/giphy.mp4',
        'https://media.giphy.com/media/3o7abldur0Y0jQj3R6/giphy.mp4',
        'https://media.giphy.com/media/3o7abnDuVuJc4D4W6E/giphy.mp4',
        'https://media.giphy.com/media/l0MYC0LajboID0xBu/giphy.mp4'
      ]
    }

    // Default GIFs if movie not found
    const defaultGifs = [
      'https://media.giphy.com/media/3o7aCTPPb4OHbRLhv6/giphy.mp4',
      'https://media.giphy.com/media/3o7abldur0Y0jQj3R6/giphy.mp4',
      'https://media.giphy.com/media/3o7abnDuVuJc4D4W6E/giphy.mp4',
      'https://media.giphy.com/media/l0MYC0LajboID0xBu/giphy.mp4'
    ]

    const gifUrls = movieGifs[movie.title] || defaultGifs

    return [
      {
        id: '1',
        title: 'Best Moments',
        videoUrl: gifUrls[0],
        thumbnail: movie.poster,
        duration: '0:30',
        views: '1.2M'
      },
      {
        id: '2',
        title: 'Behind the Scenes',
        videoUrl: gifUrls[1],
        thumbnail: movie.poster,
        duration: '0:45',
        views: '856K'
      },
      {
        id: '3',
        title: 'Action Scenes',
        videoUrl: gifUrls[2],
        thumbnail: movie.poster,
        duration: '0:25',
        views: '2.1M'
      },
      {
        id: '4',
        title: 'Memorable Quotes',
        videoUrl: gifUrls[3],
        thumbnail: movie.poster,
        duration: '0:35',
        views: '623K'
      }
    ]
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
    const video = videoRefs.current[currentShortIndex]
    if (video) {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        video.play()
        setIsPlaying(true)
      }
    }
  }

  const handleVideoRef = (index, element) => {
    if (element) {
      videoRefs.current[index] = element
      // Auto-play the first video on mount
      if (index === currentShortIndex && isPlaying) {
        element.play().catch(() => {
          setIsPlaying(false)
        })
      }
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
              {/* Video Player - Instagram Reels Style */}
              <div className="relative w-full h-full bg-black">
                {/* Try video first, fallback to GIF if video fails */}
                <video
                  ref={(el) => handleVideoRef(index, el)}
                  src={short.videoUrl}
                  poster={short.thumbnail}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  onLoadedData={() => {
                    // Auto-play when video is loaded and it's the active one
                    if (index === currentShortIndex && isPlaying) {
                      const video = videoRefs.current[index]
                      if (video) {
                        video.play().catch(() => {
                          setIsPlaying(false)
                        })
                      }
                    }
                  }}
                  onError={(e) => {
                    // If video fails, try to show GIF instead
                    const videoElement = e.target
                    const gifUrl = short.videoUrl.replace('.mp4', '.gif').replace('/giphy.mp4', '/giphy.gif')
                    // Create img element as fallback
                    const img = document.createElement('img')
                    img.src = gifUrl
                    img.className = 'w-full h-full object-cover'
                    img.onerror = () => {
                      // Final fallback to poster
                      videoElement.style.display = 'none'
                    }
                    if (videoElement.parentNode) {
                      videoElement.parentNode.insertBefore(img, videoElement)
                    }
                  }}
                />
                
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

