import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { ParticipantAvatar } from '../../components/ParticipantAvatar/ParticipantAvatar'
import { RoomCodeDisplay } from '../../components/RoomCodeDisplay/RoomCodeDisplay'
import { Button } from '../../components/Button/Button'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { FilmDetails } from '../../components/FilmDetails/FilmDetails'
import { FilmShorts } from '../../components/FilmShorts/FilmShorts'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants } from '../../utils/mockGroupState'
import { FiX, FiFilm, FiInfo, FiVideo } from 'react-icons/fi'
import { motion } from 'framer-motion'

export function GroupRoomScreen() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  
  const [movies] = useState([...mockMovies].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [participants] = useState(mockParticipants.slice(0, 4))
  const [mode, setMode] = useState('swipe') // 'swipe', 'details', 'shorts'

  // Reset mode to swipe on mount
  useEffect(() => {
    setMode('swipe')
  }, [])

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

        {/* Mode-based Content with Card Flip Animation */}
        <div className="absolute inset-0" style={{ perspective: '1200px' }}>
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
                  <div className="flex-1 relative w-full pb-20 h-full">
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
    </PhoneFrame>
  )
}

