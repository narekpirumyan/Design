import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { ParticipantAvatar } from '../../components/ParticipantAvatar/ParticipantAvatar'
import { RoomCodeDisplay } from '../../components/RoomCodeDisplay/RoomCodeDisplay'
import { Button } from '../../components/Button/Button'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants } from '../../utils/mockGroupState'
import { FiX, FiHeart, FiXCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'

export function GroupRoomScreen() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  
  const [movies] = useState([...mockMovies].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [participants] = useState(mockParticipants.slice(0, 4))

  const handleSwipe = (direction, movieId) => {
    // Simply advance to next movie
    setCurrentIndex(prev => {
      const nextIndex = prev + 1
      return nextIndex
    })
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
        <div className="absolute bottom-16 left-0 right-0 p-4">
          <div className="max-w-md mx-auto">
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => handleSwipe('left', currentMovie.id)}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all active:scale-95 border-2 border-white/30"
                aria-label="Pass"
              >
                <FiXCircle className="w-8 h-8 text-white" />
              </button>

              {/* Reaction Emojis */}
              <div className="flex gap-2">
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

              <button
                onClick={() => handleSwipe('right', currentMovie.id)}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all active:scale-95 border-2 border-white/30"
                aria-label="Like"
              >
                <FiHeart className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

