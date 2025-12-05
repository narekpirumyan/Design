import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { mockMovies } from '../../data/mockMovies'
import { FiHeart, FiXCircle, FiPlus } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

// Import different group selection approaches
import { GroupSelectionApproach1 } from './GroupSelectionApproach1'
import { GroupSelectionApproach2 } from './GroupSelectionApproach2'
import { GroupSelectionApproach3 } from './GroupSelectionApproach3'
import { GroupSelectionApproach4 } from './GroupSelectionApproach4'
import { GroupSelectionApproach5 } from './GroupSelectionApproach5'

export function IndividualSwipeScreen() {
  const navigate = useNavigate()
  const [movies] = useState([...mockMovies].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showGroupSelection, setShowGroupSelection] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedApproach, setSelectedApproach] = useState(1) // Change this to test different approaches

  const handleSwipe = (direction, movieId) => {
    if (direction === 'right') {
      // Show group selection
      const movie = movies.find(m => m.id === movieId)
      setSelectedMovie(movie)
      setShowGroupSelection(true)
    } else {
      // Just advance to next movie
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleGroupSelected = (groupId) => {
    // Handle adding movie to group
    console.log(`Adding ${selectedMovie?.title} to group ${groupId}`)
    setShowGroupSelection(false)
    setSelectedMovie(null)
    setCurrentIndex(prev => prev + 1)
  }

  const handleCloseGroupSelection = () => {
    setShowGroupSelection(false)
    setSelectedMovie(null)
  }

  if (currentIndex >= movies.length) {
    return (
      <PhoneFrame>
        <div className="h-full bg-background flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 max-w-md"
          >
            <h2 className="text-2xl font-bold text-text-primary">All done!</h2>
            <p className="text-text-secondary">
              You've seen all the movies. Check your watchlists!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary rounded-full text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Go Home
            </button>
          </motion.div>
        </div>
      </PhoneFrame>
    )
  }

  const currentMovie = movies[currentIndex]
  const nextMovies = movies.slice(currentIndex, currentIndex + 3)

  // Render different approaches based on selection
  const renderGroupSelection = () => {
    switch (selectedApproach) {
      case 1:
        return <GroupSelectionApproach1 movie={selectedMovie} onSelect={handleGroupSelected} onClose={handleCloseGroupSelection} />
      case 2:
        return <GroupSelectionApproach2 movie={selectedMovie} onSelect={handleGroupSelected} onClose={handleCloseGroupSelection} />
      case 3:
        return <GroupSelectionApproach3 movie={selectedMovie} onSelect={handleGroupSelected} onClose={handleCloseGroupSelection} />
      case 4:
        return <GroupSelectionApproach4 movie={selectedMovie} onSelect={handleGroupSelected} onClose={handleCloseGroupSelection} />
      case 5:
        return <GroupSelectionApproach5 movie={selectedMovie} onSelect={handleGroupSelected} onClose={handleCloseGroupSelection} />
      default:
        return <GroupSelectionApproach1 movie={selectedMovie} onSelect={handleGroupSelected} onClose={handleCloseGroupSelection} />
    }
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col overflow-hidden relative">
        {/* Approach Selector (for testing - remove in production) */}
        <div className="absolute top-2 right-2 z-50">
          <select
            value={selectedApproach}
            onChange={(e) => setSelectedApproach(Number(e.target.value))}
            className="text-xs bg-white/90 text-gray-900 px-2 py-1 rounded border border-gray-300"
          >
            <option value={1}>Approach 1: Bottom Sheet</option>
            <option value={2}>Approach 2: Full Overlay</option>
            <option value={3}>Approach 3: Slide Panel</option>
            <option value={4}>Approach 4: Popup Modal</option>
            <option value={5}>Approach 5: Quick Chips</option>
          </select>
        </div>

        {/* Swipe Area */}
        <div className="flex-1 relative max-w-md mx-auto w-full px-4 pb-24">
          <div className="relative w-full" style={{ height: '600px', perspective: '1000px' }}>
            {nextMovies.map((movie, idx) => (
              <SwipeableCard
                key={`${movie.id}-${currentIndex}`}
                movie={movie}
                index={idx}
                isTop={idx === 0}
                onSwipe={idx === 0 ? handleSwipe : undefined}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-surface p-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => handleSwipe('left', currentMovie.id)}
                className="w-16 h-16 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all active:scale-95"
                aria-label="Pass"
              >
                <FiXCircle className="w-8 h-8 text-red-400" />
              </button>

              <button
                onClick={() => handleSwipe('right', currentMovie.id)}
                className="w-16 h-16 rounded-full bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition-all active:scale-95"
                aria-label="Like"
              >
                <FiHeart className="w-8 h-8 text-green-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Group Selection Overlay */}
        <AnimatePresence>
          {showGroupSelection && renderGroupSelection()}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  )
}

