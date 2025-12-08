import { motion, useMotionValue, useTransform } from 'framer-motion'
import { MovieCard } from '../MovieCard/MovieCard'

export function SwipeableCard({ 
  movie, 
  onSwipe,
  onReaction,
  index = 0,
  isTop = true 
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (event, info) => {
    const threshold = 100
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      const direction = info.offset.x > 0 ? 'right' : 'left'
      onSwipe(direction, movie.id)
    } else {
      // Spring back to center
      x.set(0)
    }
  }

  const cardVariants = {
    initial: { scale: 1, rotate: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction === 'right' ? 1000 : -1000,
      rotate: direction === 'right' ? 30 : -30,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.4, ease: 'easeInOut' }
    })
  }

  const likeOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1])
  const passOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0])

  return (
    <motion.div
      className="absolute inset-0 w-full h-full swipeable"
      style={{ 
        zIndex: isTop ? 10 : 10 - index,
        x,
        rotate,
        opacity: isTop ? opacity : 1
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      initial="initial"
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      animate={{
        scale: isTop ? 1 : 0.95 - index * 0.05,
        y: isTop ? 0 : index * 10
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <MovieCard movie={movie} />
      {isTop && (
        <>
          <motion.div 
            className="absolute top-4 left-4 bg-green-500/90 text-white px-6 py-3 rounded-full font-bold text-xl pointer-events-none transform -rotate-12 border-4 border-white/50"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>
          <motion.div 
            className="absolute top-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-full font-bold text-xl pointer-events-none transform rotate-12 border-4 border-white/50"
            style={{ opacity: passOpacity }}
          >
            PASS
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

