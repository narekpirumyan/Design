import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ScrollableCard } from '../ScrollableCard/ScrollableCard'

export function ScrollableCardStack({ 
  movies, 
  onLike, 
  onPass,
  onInfo,
  currentIndex = 0,
  onIndexChange
}) {
  const containerRef = useRef(null)
  const [snapIndex, setSnapIndex] = useState(currentIndex)
  
  // Use viewport height for positioning
  const getViewportHeight = () => {
    if (containerRef.current) {
      return containerRef.current.clientHeight
    }
    return window.innerHeight
  }
  
  const y = useMotionValue(-currentIndex * getViewportHeight())
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  // Update snap index when currentIndex prop changes
  useEffect(() => {
    setSnapIndex(currentIndex)
    const vh = getViewportHeight()
    y.set(-currentIndex * vh)
  }, [currentIndex, y])

  const handleDragEnd = (event, info) => {
    const threshold = 50
    const velocity = info.velocity.y
    const vh = getViewportHeight()

    let newIndex = snapIndex

    if (Math.abs(info.offset.y) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.y > 0 && snapIndex > 0) {
        // Swipe down - go to previous
        newIndex = snapIndex - 1
      } else if (info.offset.y < 0 && snapIndex < movies.length - 1) {
        // Swipe up - go to next
        newIndex = snapIndex + 1
      }
    }

    setSnapIndex(newIndex)
    onIndexChange?.(newIndex)
    // Update the motion value to snap to the new position
    y.set(-newIndex * vh)
  }

  const handleLike = (movieId) => {
    // Move to next movie after like
    if (snapIndex < movies.length - 1) {
      const newIndex = snapIndex + 1
      setSnapIndex(newIndex)
      onIndexChange?.(newIndex)
      const vh = getViewportHeight()
      y.set(-newIndex * vh)
    }
    onLike?.(movieId)
  }

  const handlePass = (movieId) => {
    // Move to next movie after pass
    if (snapIndex < movies.length - 1) {
      const newIndex = snapIndex + 1
      setSnapIndex(newIndex)
      onIndexChange?.(newIndex)
      const vh = getViewportHeight()
      y.set(-newIndex * vh)
    }
    onPass?.(movieId)
  }

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      drag="y"
      dragConstraints={{ 
        top: -(movies.length - 1) * (containerRef.current?.clientHeight || window.innerHeight),
        bottom: 0
      }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      style={{ 
        y: springY,
        cursor: 'grab',
        height: `${movies.length * 100}%`
      }}
    >
      {movies.map((movie, idx) => {
        const vh = containerRef.current?.clientHeight || window.innerHeight
        // Show card if it's within viewport (current, previous, or next)
        const isVisible = Math.abs(idx - snapIndex) <= 1
        
        return (
          <div
            key={`${movie.id}-${idx}`}
            className="absolute w-full"
            style={{
              top: `${idx * 100}%`,
              left: 0,
              right: 0,
              height: '100%',
              zIndex: movies.length - idx
            }}
          >
            <ScrollableCard
              movie={movie}
              onLike={handleLike}
              onPass={handlePass}
              onInfo={onInfo}
              index={idx}
              isVisible={isVisible}
            />
          </div>
        )
      })}
    </motion.div>
  )
}
