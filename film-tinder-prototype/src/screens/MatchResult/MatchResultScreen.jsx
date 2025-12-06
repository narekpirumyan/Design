import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { VibeTag } from '../../components/VibeTag/VibeTag'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { BackButton } from '../../components/BackButton/BackButton'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants } from '../../utils/mockGroupState'
import { motion } from 'framer-motion'
import { FiShare2, FiPlay, FiCalendar, FiExternalLink } from 'react-icons/fi'

export function MatchResultScreen() {
  const { roomCode } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const matchMovieId = location.state?.matchMovieId
  const matches = location.state?.matches || []
  const participants = mockParticipants.slice(0, 4)

  // Get the match movie - prioritize matchMovieId, then first match, then fallback to mock data
  let matchMovie = null
  if (matchMovieId) {
    matchMovie = mockMovies.find(m => m.id === matchMovieId)
  }
  if (!matchMovie && matches.length > 0 && matches[0].movieId) {
    matchMovie = mockMovies.find(m => m.id === matches[0].movieId)
  }
  if (!matchMovie) {
    matchMovie = mockMovies[0] // Fallback to first mock movie
  }

  // Get alternative matches from state or use mock data
  const alternativeMatches = matches.length > 1
    ? matches
        .slice(1, 4)
        .map(m => mockMovies.find(movie => movie.id === m.movieId))
        .filter(Boolean)
    : mockMovies.slice(1, 4) // Fallback to mock movies

  const matchInfo = matches.length > 0 
    ? (matches.find(m => m.movieId === matchMovieId) || matches[0])
    : { likedBy: true, likedByCount: participants.length, matchPercentage: 100 }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `We found a match: ${matchMovie.title}!`,
        text: `Check out ${matchMovie.title} (${matchMovie.year}) on Film Tinder`,
      })
    } else {
      navigator.clipboard.writeText(`We found a match: ${matchMovie.title}!`)
      alert('Match details copied to clipboard!')
    }
  }

  const handleNewRoom = () => {
    navigate('/groups')
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-16">
        {/* Header */}
        <div className="p-4">
          <BackButton 
            to={`/room/${roomCode}`} 
            label="Back to Room"
            className="text-white/80 hover:text-white"
          />
        </div>

      <div className="max-w-md mx-auto px-4 pb-8 space-y-6">
        {/* Celebration */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.1
          }}
          className="text-center space-y-4"
        >
          <motion.div 
            className="text-6xl"
            animate={{ 
              rotate: [0, 10, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.6,
              repeat: 2,
              repeatDelay: 0.3
            }}
          >
            🎉
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-text-primary"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            It's a Match!
          </motion.h1>
          <motion.p 
            className="text-text-secondary"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {matchInfo?.likedBy 
              ? `Liked by all ${participants.length} members`
              : `Liked by ${matchInfo?.likedByCount || participants.length} members`
            }
          </motion.p>
        </motion.div>

        {/* Match Movie Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-2xl overflow-hidden border border-surface"
        >
          <div className="relative h-96">
            <img
              src={matchMovie.poster}
              alt={matchMovie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {matchMovie.title}
              </h2>
              <p className="text-xl text-text-secondary mb-4">
                {matchMovie.year}
              </p>
              <div className="flex flex-wrap gap-2">
                {matchMovie.vibeTags.map(tag => (
                  <VibeTag key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-text-secondary">{matchMovie.description}</p>

            {/* Streaming Services */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-text-muted uppercase">Available On</h3>
              <div className="flex flex-wrap gap-2">
                {matchMovie.streamingServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 bg-primary/20 rounded-lg text-sm text-primary border border-primary/30"
                  >
                    {service.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(matchMovie.title + ' streaming')}`, '_blank')}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
          >
            <FiExternalLink className="w-5 h-5" />
            Check Streaming Options
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <FiShare2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              onClick={() => alert('Reminder feature coming soon!')}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <FiCalendar className="w-4 h-4" />
              Remind
            </Button>
          </div>

          <Button
            onClick={handleNewRoom}
            variant="outline"
            className="w-full"
          >
            Create New Room
          </Button>
        </motion.div>

        {/* Alternative Matches */}
        {alternativeMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-text-primary">Other Options</h3>
            <div className="space-y-3">
              {alternativeMatches.map((movie, idx) => (
                <div
                  key={movie.id}
                  className="bg-surface rounded-lg p-4 flex gap-4 border border-surface"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-20 h-28 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x112/1e293b/94a3b8?text=No+Poster'
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary">{movie.title}</h4>
                    <p className="text-sm text-text-secondary">{movie.year}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie.vibeTags.slice(0, 2).map(tag => (
                        <VibeTag key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

