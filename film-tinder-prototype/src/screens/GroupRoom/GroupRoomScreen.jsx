import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { ParticipantAvatar } from '../../components/ParticipantAvatar/ParticipantAvatar'
import { RoomCodeDisplay } from '../../components/RoomCodeDisplay/RoomCodeDisplay'
import { Button } from '../../components/Button/Button'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { ModeSelector } from '../../components/ModeSelector/ModeSelector'
import { FilmDetails } from '../../components/FilmDetails/FilmDetails'
import { FilmShorts } from '../../components/FilmShorts/FilmShorts'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants } from '../../utils/mockGroupState'
import { FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'

export function GroupRoomScreen() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  
  const [movies] = useState([...mockMovies].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [participants] = useState(mockParticipants.slice(0, 4))
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
      // Simply advance to next movie
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        return nextIndex
      })
    } else {
      // In details/shorts mode, swiping goes back to swipe mode
      setMode('swipe')
    }
  }

  const handleAddToWatchlist = (movieId) => {
    // In group mode, this could show a different UI
    console.log('Add to watchlist:', movieId)
  }

  const handleModeChange = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode)
    }
    setShowModeSelector(false)
  }

  const handleReaction = (emoji) => {
    // Visual only - no state tracking needed
  }

  const handleLeaveRoom = () => {
    if (window.confirm('Leave this room?')) {
      navigate('/')
    }
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
            <h2 className="text-2xl font-bold text-white">No more movies!</h2>
            <p className="text-white/90">
              You've seen all the movies. Try a new room!
            </p>
            <div className="flex flex-col gap-4 justify-center">
              <Button onClick={() => navigate(`/match/${roomCode}`, { 
                state: { 
                  matchMovieId: mockMovies[0].id,
                  matches: [{ movieId: mockMovies[0].id, likedBy: true, likedByCount: participants.length, matchPercentage: 100 }]
                } 
              })}>
                View Matches
              </Button>
              <Button onClick={() => navigate('/')} variant="secondary">
                New Room
              </Button>
            </div>
          </motion.div>
          <BottomNavigation />
        </div>
      </PhoneFrame>
    )
  }

  const currentMovie = movies[currentIndex]
  const nextMovies = movies.slice(currentIndex, currentIndex + 3)

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col overflow-hidden relative pb-16">
        {/* Header */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <RoomCodeDisplay roomCode={roomCode} />
            <button
              onClick={handleLeaveRoom}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
              aria-label="Leave room"
            >
              <FiX className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">Participants:</span>
            <div className="flex gap-2">
              {participants.map((participant) => (
                <ParticipantAvatar
                  key={participant.id}
                  participant={participant}
                  isActive={false}
                />
              ))}
            </div>
          </div>
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

              {/* Reaction Emojis */}
              <div className="absolute bottom-16 left-0 right-0 p-4">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    {['🔥', '😂', '😴', '🤯'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-xl transition-all active:scale-95 border-2 border-white/30"
                        aria-label={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
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
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

