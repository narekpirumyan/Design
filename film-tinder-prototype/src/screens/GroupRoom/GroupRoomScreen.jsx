import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { ParticipantAvatar } from '../../components/ParticipantAvatar/ParticipantAvatar'
import { RoomCodeDisplay } from '../../components/RoomCodeDisplay/RoomCodeDisplay'
import { Button } from '../../components/Button/Button'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants, simulateOtherUserSwipe, findMatches } from '../../utils/mockGroupState'
import { FiX, FiHeart, FiXCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export function GroupRoomScreen() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  
  const [movies, setMovies] = useState([...mockMovies].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipes, setSwipes] = useState([])
  const [participants] = useState(mockParticipants.slice(0, 4))
  const [iDontCare, setIDontCare] = useState(false)
  const [reactions, setReactions] = useState([])
  const [otherUserSwipes, setOtherUserSwipes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const simulationTimeoutRef = useRef(null)
  const matchCheckTimeoutRef = useRef(null)

  const currentUser = participants.find(p => p.isCurrentUser)

  // Simulate other users swiping
  useEffect(() => {
    if (currentIndex >= movies.length) return

    const simulateSwipe = () => {
      const delay = 2000 + Math.random() * 3000 // 2-5 seconds
      
      simulationTimeoutRef.current = setTimeout(() => {
        const currentMovie = movies[currentIndex]
        if (!currentMovie) return

        const simulatedSwipe = simulateOtherUserSwipe(
          currentMovie.id,
          participants,
          currentUser.id
        )

        if (simulatedSwipe) {
          setOtherUserSwipes(prev => [...prev, simulatedSwipe])
          
          // Add to swipes
          setSwipes(prev => [...prev, {
            userId: simulatedSwipe.userId,
            movieId: simulatedSwipe.movieId,
            direction: simulatedSwipe.direction,
            timestamp: simulatedSwipe.timestamp
          }])

          // Check for matches
          const allSwipes = [...swipes, {
            userId: simulatedSwipe.userId,
            movieId: simulatedSwipe.movieId,
            direction: simulatedSwipe.direction,
            timestamp: simulatedSwipe.timestamp
          }]

          const matches = findMatches(allSwipes, participants)
          if (matches.length > 0 && matches[0].matchPercentage >= 75) {
            // Good match! (75% or higher) Navigate to result
            setTimeout(() => {
              navigate(`/match/${roomCode}`, { 
                state: { 
                  matchMovieId: matches[0].movieId,
                  matches 
                } 
              })
            }, 1000)
            return
          }
        }

        // Continue simulation if there are more movies
        if (currentIndex < movies.length - 1) {
          simulateSwipe()
        }
      }, delay)
    }

    simulateSwipe()

    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current)
      }
      if (matchCheckTimeoutRef.current) {
        clearTimeout(matchCheckTimeoutRef.current)
      }
    }
  }, [currentIndex, movies, participants, currentUser.id, swipes, navigate, roomCode])

  const handleSwipe = (direction, movieId) => {
    if (iDontCare) {
      // If "I Don't Care" is active, just move to next
      setCurrentIndex(prev => prev + 1)
      return
    }

    setIsLoading(true)

    const swipe = {
      userId: currentUser.id,
      movieId,
      direction,
      timestamp: Date.now()
    }

    const newSwipes = [...swipes, swipe]
    setSwipes(newSwipes)

    // Clear any existing match check timeout
    if (matchCheckTimeoutRef.current) {
      clearTimeout(matchCheckTimeoutRef.current)
    }

    // Check for matches after a delay to allow simulated users to swipe
    matchCheckTimeoutRef.current = setTimeout(() => {
      // Re-read swipes from state to get latest (including simulated user swipes)
      setSwipes(currentSwipes => {
        const matches = findMatches(currentSwipes, participants)
        
        if (matches.length > 0 && matches[0].matchPercentage >= 75) {
          // Good match! (75% or higher)
          setIsLoading(false)
          navigate(`/match/${roomCode}`, { 
            state: { 
              matchMovieId: matches[0].movieId,
              matches 
            } 
          })
          return currentSwipes
        }

        // Move to next movie
        setIsLoading(false)
        setCurrentIndex(prev => prev + 1)
        return currentSwipes
      })
    }, 3000) // Wait 3 seconds for simulated users to swipe on this movie
  }

  const handleReaction = (emoji) => {
    setReactions(prev => [...prev, {
      emoji,
      userId: currentUser.id,
      timestamp: Date.now()
    }])
  }

  const handleLeaveRoom = () => {
    if (window.confirm('Leave this room?')) {
      navigate('/')
    }
  }

  if (currentIndex >= movies.length) {
    const finalMatches = findMatches(swipes, participants)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-md"
        >
          <h2 className="text-2xl font-bold text-text-primary">No more movies!</h2>
          <p className="text-text-secondary">
            {finalMatches.length > 0 
              ? `Found ${finalMatches.length} potential match${finalMatches.length > 1 ? 'es' : ''}!`
              : 'No matches found. Try a new room with different preferences.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {finalMatches.length > 0 && (
              <Button onClick={() => navigate(`/match/${roomCode}`, { 
                state: { 
                  matchMovieId: finalMatches[0].movieId,
                  matches: finalMatches 
                } 
              })}>
                View Matches
              </Button>
            )}
            <Button onClick={() => navigate('/')} variant="secondary">
              New Room
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentMovie = movies[currentIndex]
  const nextMovies = movies.slice(currentIndex, currentIndex + 3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            {participants.map((participant, idx) => {
              const hasSwiped = swipes.some(
                s => s.userId === participant.id && 
                s.movieId === currentMovie?.id
              )
              return (
                <ParticipantAvatar
                  key={participant.id}
                  participant={participant}
                  isActive={hasSwiped}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Swipe Area */}
      <div className="flex-1 relative max-w-md mx-auto w-full px-4 pb-24">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface/90 backdrop-blur-sm rounded-full px-4 py-2"
            >
              <span className="text-text-primary">Processing...</span>
            </motion.div>
          </div>
        )}
        <div className="relative w-full" style={{ height: '600px', perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            {nextMovies.map((movie, idx) => (
              <SwipeableCard
                key={`${movie.id}-${currentIndex}`}
                movie={movie}
                index={idx}
                isTop={idx === 0 && !isLoading}
                onSwipe={idx === 0 && !isLoading ? handleSwipe : undefined}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Swipe Indicators */}
        <AnimatePresence>
          {otherUserSwipes
            .filter(s => s.movieId === currentMovie?.id)
            .map((swipe, idx) => (
              <motion.div
                key={`${swipe.userId}-${swipe.timestamp}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
              >
                <span className="text-text-primary">
                  {swipe.userName} {swipe.direction === 'right' ? 'liked' : 'passed'} this
                </span>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-surface p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* I Don't Care Toggle & Check Matches */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIDontCare(!iDontCare)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                iDontCare
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-secondary hover:bg-surface/80'
              }`}
            >
              {iDontCare ? '✓ I Don\'t Care' : 'I Don\'t Care'}
            </button>
            <button
              onClick={() => {
                const matches = findMatches(swipes, participants)
                if (matches.length > 0) {
                  navigate(`/match/${roomCode}`, { 
                    state: { 
                      matchMovieId: matches[0].movieId,
                      matches 
                    } 
                  })
                } else {
                  alert('No matches yet. Keep swiping!')
                }
              }}
              className="px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-all"
            >
              Check Matches
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => handleSwipe('left', currentMovie.id)}
              className="w-16 h-16 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all active:scale-95"
              aria-label="Pass"
            >
              <FiXCircle className="w-8 h-8 text-red-400" />
            </button>

            {/* Reaction Emojis */}
            <div className="flex gap-2">
              {['🔥', '😂', '😴', '🤯'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="w-12 h-12 rounded-full bg-surface hover:bg-surface/80 flex items-center justify-center text-xl transition-all active:scale-95"
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

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
    </div>
  )
}

