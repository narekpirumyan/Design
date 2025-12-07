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
  const [containerHeight, setContainerHeight] = useState(0)
  
  // Get container height for positioning
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement
        if (parent) {
          setContainerHeight(parent.clientHeight)
        }
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])
  
  const y = useMotionValue(-currentIndex * containerHeight)
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  // Update snap index when currentIndex prop changes
  useEffect(() => {
    setSnapIndex(currentIndex)
    if (containerHeight > 0) {
      y.set(-currentIndex * containerHeight)
    }
  }, [currentIndex, containerHeight, y])

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
    if (containerHeight > 0) {
      y.set(-newIndex * containerHeight)
    }
  }

  const handleLike = (movieId) => {
    // Move to next movie after like
    if (snapIndex < movies.length - 1) {
      const newIndex = snapIndex + 1
      setSnapIndex(newIndex)
      onIndexChange?.(newIndex)
      if (containerHeight > 0) {
        y.set(-newIndex * containerHeight)
      }
    }
    onLike?.(movieId)
  }

  const handlePass = (movieId) => {
    // Move to next movie after pass
    if (snapIndex < movies.length - 1) {
      const newIndex = snapIndex + 1
      setSnapIndex(newIndex)
      onIndexChange?.(newIndex)
      if (containerHeight > 0) {
        y.set(-newIndex * containerHeight)
      }
    }
    onPass?.(movieId)
  }

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full overflow-hidden"
      drag="y"
      dragConstraints={{ 
        top: containerHeight > 0 ? -(movies.length - 1) * containerHeight : 0,
        bottom: 0
      }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      style={{ 
        y: springY,
        cursor: 'grab',
        height: containerHeight > 0 ? `${movies.length * containerHeight}px` : 'auto'
      }}
    >
      {movies.map((movie, idx) => {
        // Show card if it's within viewport (current, previous, or next)
        const isVisible = Math.abs(idx - snapIndex) <= 1
        
        return (
          <div
            key={`${movie.id}-${idx}`}
            className="absolute w-full"
            style={{
              top: containerHeight > 0 ? `${idx * containerHeight}px` : `${idx * 100}%`,
              left: 0,
              right: 0,
              height: containerHeight > 0 ? `${containerHeight}px` : '100%',
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
