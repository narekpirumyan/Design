import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { ModeSelector } from '../../components/ModeSelector/ModeSelector'
import { FilmDetails } from '../../components/FilmDetails/FilmDetails'
import { FilmShorts } from '../../components/FilmShorts/FilmShorts'
import { mockMovies } from '../../data/mockMovies'
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
  const [selectedApproach, setSelectedApproach] = useState(1)
  const [mode, setMode] = useState('swipe') // 'swipe', 'details', 'shorts'
  const [showModeSelector, setShowModeSelector] = useState(false)
  
  const pressTimerRef = useRef(null)
  const swipeAreaRef = useRef(null)

  // Reset mode to swipe on mount
  useEffect(() => {
    setMode('swipe')
    setShowModeSelector(false)
  }, [])

  // Press and hold detection
  useEffect(() => {
    const swipeArea = swipeAreaRef.current
    if (!swipeArea || showModeSelector) return // Don't attach if selector is already open

    const handleTouchStart = (e) => {
      // Prevent card swipe during hold
      e.preventDefault()
      pressTimerRef.current = setTimeout(() => {
        setShowModeSelector(true)
      }, 500) // 500ms hold
    }

    const handleTouchEnd = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
      }
    }

    const handleMouseDown = (e) => {
      pressTimerRef.current = setTimeout(() => {
        setShowModeSelector(true)
      }, 500)
    }

    const handleMouseUp = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
      }
    }

    swipeArea.addEventListener('touchstart', handleTouchStart, { passive: false })
    swipeArea.addEventListener('touchend', handleTouchEnd)
    swipeArea.addEventListener('mousedown', handleMouseDown)
    swipeArea.addEventListener('mouseup', handleMouseUp)
    swipeArea.addEventListener('mouseleave', handleMouseUp)

    return () => {
      swipeArea.removeEventListener('touchstart', handleTouchStart)
      swipeArea.removeEventListener('touchend', handleTouchEnd)
      swipeArea.removeEventListener('mousedown', handleMouseDown)
      swipeArea.removeEventListener('mouseup', handleMouseUp)
      swipeArea.removeEventListener('mouseleave', handleMouseUp)
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
      }
    }
  }, [showModeSelector])

  const handleSwipe = (direction, movieId) => {
    if (mode === 'swipe') {
      if (direction === 'right') {
        // Show group selection
        const movie = movies.find(m => m.id === movieId)
        setSelectedMovie(movie)
        setShowGroupSelection(true)
      } else {
        // Just advance to next movie
        setCurrentIndex(prev => prev + 1)
      }
    } else {
      // In details/shorts mode, swiping goes back to swipe mode
      setMode('swipe')
    }
  }

  const handleAddToWatchlist = (movieId) => {
    const movie = movies.find(m => m.id === movieId)
    setSelectedMovie(movie)
    setShowGroupSelection(true)
  }

  const handleModeChange = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode)
    }
    setShowModeSelector(false)
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
        <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex items-center justify-center p-6 pb-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 max-w-md"
          >
            <h2 className="text-2xl font-bold text-white">All done!</h2>
            <p className="text-white/90">
              You've seen all the movies. Check your watchlists!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Go Home
            </button>
          </motion.div>
          <BottomNavigation />
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

        {/* Mode-based Content with Zoom Animation */}
        <motion.div
          animate={{
            scale: showModeSelector ? 0.6 : 1,
            opacity: showModeSelector ? 0.3 : 1
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="absolute inset-0"
          style={{ 
            transformOrigin: 'center center',
            pointerEvents: showModeSelector ? 'none' : 'auto'
          }}
        >
          {mode === 'swipe' && (
            <>
              {/* Swipe Area */}
              <div 
                ref={swipeAreaRef}
                className="flex-1 relative w-full pb-20 h-full"
              >
                <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
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
            </>
          )}

          {mode === 'details' && (
            <div ref={swipeAreaRef} className="h-full">
              <FilmDetails
                movie={currentMovie}
                onBack={() => setMode('swipe')}
                onSwipe={handleSwipe}
                onAddToWatchlist={handleAddToWatchlist}
              />
            </div>
          )}

          {mode === 'shorts' && (
            <div ref={swipeAreaRef} className="h-full">
              <FilmShorts
                movie={currentMovie}
                onBack={() => setMode('swipe')}
                onSwipe={handleSwipe}
                onAddToWatchlist={handleAddToWatchlist}
              />
            </div>
          )}
        </motion.div>

        {/* Mode Selector */}
        {showModeSelector && (
          <ModeSelector
            currentMode={mode}
            onModeChange={handleModeChange}
            isVisible={showModeSelector}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Group Selection Overlay */}
        <AnimatePresence>
          {showGroupSelection && renderGroupSelection()}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  )
}

