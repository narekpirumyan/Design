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
  const y = useMotionValue(-currentIndex * 100)
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  // Update snap index when currentIndex prop changes
  useEffect(() => {
    setSnapIndex(currentIndex)
    y.set(-currentIndex * 100)
  }, [currentIndex, y])

  const handleDragEnd = (event, info) => {
    const threshold = 50
    const velocity = info.velocity.y

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
    y.set(-newIndex * 100)
  }

  const handleLike = (movieId) => {
    // Move to next movie after like
    if (snapIndex < movies.length - 1) {
      const newIndex = snapIndex + 1
      setSnapIndex(newIndex)
      onIndexChange?.(newIndex)
    }
    onLike?.(movieId)
  }

  const handlePass = (movieId) => {
    // Move to next movie after pass
    if (snapIndex < movies.length - 1) {
      const newIndex = snapIndex + 1
      setSnapIndex(newIndex)
      onIndexChange?.(newIndex)
    }
    onPass?.(movieId)
  }

  // Calculate container height to fit all cards
  const containerHeight = movies.length * 100

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full overflow-hidden"
      drag="y"
      dragConstraints={{ 
        top: -(movies.length - 1) * 100,
        bottom: 0
      }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      style={{ 
        y: springY,
        cursor: 'grab',
        height: `${containerHeight}%`
      }}
    >
      {movies.map((movie, idx) => (
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
            isVisible={idx === snapIndex}
          />
        </div>
      ))}
    </motion.div>
  )
}
