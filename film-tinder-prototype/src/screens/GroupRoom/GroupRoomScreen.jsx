import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { ParticipantAvatar } from '../../components/ParticipantAvatar/ParticipantAvatar'
import { RoomCodeDisplay } from '../../components/RoomCodeDisplay/RoomCodeDisplay'
import { Button } from '../../components/Button/Button'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { TutorialGuide } from '../../components/TutorialGuide/TutorialGuide'
import { FilmDetails } from '../../components/FilmDetails/FilmDetails'
import { FilmShorts } from '../../components/FilmShorts/FilmShorts'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants } from '../../utils/mockGroupState'
import { FiX, FiFilm, FiInfo, FiVideo } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getTutorialSteps } from '../../data/tutorialSteps'

export function GroupRoomScreen() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { user, hasCompletedTutorial, completeTutorial, skipTutorial } = useAuth()
  
  const [movies] = useState([...mockMovies].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [participants] = useState(mockParticipants.slice(0, 5)) // 5 participants to show 3 + "+2"
  const [mode, setMode] = useState('swipe') // 'swipe', 'details', 'shorts'
  const [showTutorial, setShowTutorial] = useState(false)

  // Reset mode to swipe on mount
  useEffect(() => {
    setMode('swipe')
  }, [])

  // Check if tutorial should be shown on first visit
  useEffect(() => {
    if (!user) {
      setShowTutorial(false)
      return
    }
    
    if (!hasCompletedTutorial('room')) {
      // Small delay to ensure smooth screen transition
      const timer = setTimeout(() => {
        setShowTutorial(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowTutorial(false)
    }
  }, [user, hasCompletedTutorial])

  const modes = ['swipe', 'details', 'shorts']
  const currentModeIndex = modes.indexOf(mode)
  const nextModeIndex = (currentModeIndex + 1) % modes.length
  const nextMode = modes[nextModeIndex]

  const modeIcons = {
    swipe: FiFilm,
    details: FiInfo,
    shorts: FiVideo
  }

  const handleModeToggle = () => {
    setMode(nextMode)
  }

  const handleSwipe = (direction, movieId) => {
    if (mode === 'swipe') {
      // Simply advance to next movie
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        // If we've swiped through all movies, navigate to matches
        if (nextIndex >= movies.length) {
          navigate(`/match/${roomCode}`, { 
            state: { 
              matchMovieId: mockMovies[0].id,
              matches: [{ movieId: mockMovies[0].id, likedBy: true, likedByCount: participants.length, matchPercentage: 100 }]
            } 
          })
          return prev // Keep current index to prevent re-render
        }
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


  const handleReaction = (emoji) => {
    // Visual only - no state tracking needed
  }

  const handleLeaveRoom = () => {
    if (window.confirm('Leave this room?')) {
      navigate('/groups')
    }
  }

  // Prevent index from going beyond movies array
  const safeIndex = Math.min(currentIndex, movies.length - 1)
  const currentMovie = movies[safeIndex]
  const nextMovies = movies.slice(safeIndex, safeIndex + 3)

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col overflow-hidden relative pb-16">
        {/* Header */}
        <div className="p-4 relative z-10">
          <div className="flex items-center justify-between">
            <div data-tutorial-target="room-code" className="flex items-center gap-3">
              <RoomCodeDisplay roomCode={roomCode} />
              {/* Participants in room code area */}
              <div className="flex items-center gap-1.5" data-tutorial-target="participants">
                {participants.slice(0, 3).map((participant) => (
                  <ParticipantAvatar
                    key={participant.id}
                    participant={participant}
                    isActive={false}
                    showName={false}
                    size="small"
                  />
                ))}
                {participants.length > 3 && (
                  <span className="text-xs text-white/80 font-medium ml-1">+{participants.length - 3}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Leave room"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Mode-based Content with Card Flip Animation */}
        <div className="absolute top-24 left-0 right-0 bottom-0" style={{ perspective: '1200px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                duration: 0.6
              }}
              style={{
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%'
              }}
              className="relative"
            >
              {mode === 'swipe' && (
                <>
                  {/* Swipe Area */}
                  <div className="relative w-full h-full pb-20">
                    <div className="relative w-full h-full swipe-area" style={{ perspective: '1000px' }}>
                      {nextMovies.length > 0 ? (
                        nextMovies.map((movie, idx) => (
                          <SwipeableCard
                            key={`${movie.id}-${currentIndex}`}
                            movie={movie}
                            index={idx}
                            isTop={idx === 0}
                            onSwipe={idx === 0 ? handleSwipe : undefined}
                            onReaction={idx === 0 ? handleReaction : undefined}
                          />
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-white">
                          <p>No movies available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vertical Reaction Buttons - Right Bottom */}
                  <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-2">
                    {['🔥', '😂', '😴'].map(emoji => (
                      <motion.button
                        key={emoji}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReaction(emoji)
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-lg transition-all active:scale-95 border-2 border-white/30 shadow-lg"
                        aria-label={`React with ${emoji}`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {mode === 'details' && (
                <div className="h-full">
                  <FilmDetails
                    movie={currentMovie}
                    onBack={() => setMode('swipe')}
                    onSwipe={handleSwipe}
                    onAddToWatchlist={handleAddToWatchlist}
                  />
                </div>
              )}

              {mode === 'shorts' && (
                <div className="h-full">
                  <FilmShorts
                    movie={currentMovie}
                    onBack={() => setMode('swipe')}
                    onSwipe={handleSwipe}
                    onAddToWatchlist={handleAddToWatchlist}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mode Switch Button - Camera Switch Style */}
        <div className="absolute top-20 left-4 z-30">
          <motion.button
            onClick={handleModeToggle}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border-2 border-white/30 flex items-center justify-center transition-all hover:bg-black/70 hover:border-white/50 shadow-lg"
            aria-label={`Switch to ${nextMode} mode`}
            title={`Switch to ${nextMode.charAt(0).toUpperCase() + nextMode.slice(1)}`}
          >
            <motion.div
              key={nextMode}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const Icon = modeIcons[nextMode]
                return <Icon className="w-6 h-6 text-white" />
              })()}
            </motion.div>
          </motion.button>
        </div>
      </div>
      <BottomNavigation />

      {/* Tutorial Guide */}
      {showTutorial && (
        <TutorialGuide
          steps={getTutorialSteps('room', user)}
          sectionId="room"
          isActive={showTutorial}
          onComplete={(sectionId) => {
            completeTutorial(sectionId)
            setShowTutorial(false)
          }}
          onSkip={(sectionId) => {
            skipTutorial(sectionId)
            setShowTutorial(false)
          }}
        />
      )}
    </PhoneFrame>
  )
}

