import { motion } from 'framer-motion'
import { FiPlay, FiStar, FiMessageCircle, FiExternalLink, FiChevronLeft } from 'react-icons/fi'
import { VibeTag } from '../VibeTag/VibeTag'

// Get trailer video ID for each movie
const getTrailerVideoId = (movieTitle) => {
  const trailerIds = {
    'Inception': 'YoHD9XEInc0',
    'The Grand Budapest Hotel': '1Fg5iWmB5c0',
    'Parasite': '5xH0HfJHsaY',
    'Spirited Away': 'ByXuk9QqQkk',
    'Mad Max: Fury Road': 'hEJnMQG9ev8'
  }
  return trailerIds[movieTitle] || 'YoHD9XEInc0' // Default to Inception if not found
}

export function FilmDetails({ movie, onBack, onSwipe, onAddToWatchlist }) {
  // Mock data for details
  const cast = [
    { name: 'Leonardo DiCaprio', role: 'Cobb' },
    { name: 'Marion Cotillard', role: 'Mal' },
    { name: 'Tom Hardy', role: 'Eames' },
    { name: 'Ellen Page', role: 'Ariadne' }
  ]

  const reviews = [
    { user: 'MovieFan123', rating: 5, comment: 'Mind-blowing! One of the best films ever made.' },
    { user: 'CinemaLover', rating: 5, comment: 'Nolan at his finest. The visuals are stunning.' },
    { user: 'FilmCritic', rating: 4, comment: 'Complex plot but incredibly well executed.' }
  ]

  const comments = [
    { user: 'Alex', text: 'The ending still confuses me 😅', time: '2h ago' },
    { user: 'Sarah', text: 'Watched this 5 times and still finding new details!', time: '5h ago' },
    { user: 'Mike', text: 'The score by Hans Zimmer is incredible', time: '1d ago' }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20 relative">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-red-700/95 to-transparent backdrop-blur-sm pb-4">
        <button
          onClick={onBack}
          className="p-4 flex items-center gap-2 text-white hover:text-white/80 transition-colors"
        >
          <FiChevronLeft className="w-6 h-6" />
          <span>Back</span>
        </button>
      </div>

      {/* Trailer Hero Section */}
      <div className="relative h-96" style={{ overflow: 'hidden' }}>
        {/* YouTube Trailer - Autoplay */}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${getTrailerVideoId(movie.title)}?autoplay=1&mute=1&loop=1&playlist=${getTrailerVideoId(movie.title)}&controls=0&modestbranding=1&rel=0&playsinline=1`}
          className="absolute inset-0 w-full h-full"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            objectFit: 'cover'
          }}
          frameBorder="0"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={`${movie.title} Trailer`}
        />
        {/* Fallback poster if video fails */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
            e.target.style.opacity = '1'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-700 via-red-600/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
          <p className="text-xl text-white/90 mb-4">{movie.year}</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">8.8</span>
            </div>
            <span className="text-white/80">•</span>
            <span className="text-white/80">2h 28m</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.vibeTags.map(tag => (
              <VibeTag key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">

        {/* Description */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <h2 className="text-xl font-bold text-white mb-2">Synopsis</h2>
          <p className="text-white/90 leading-relaxed">{movie.description}</p>
        </div>

        {/* Cast */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((actor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[140px]"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center text-2xl">
                  👤
                </div>
                <p className="text-white font-semibold text-sm text-center">{actor.name}</p>
                <p className="text-white/70 text-xs text-center">{actor.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Streaming Options */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Where to Watch</h2>
          <div className="space-y-2">
            {movie.streamingServices.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <span className="text-lg">{service.name === 'Netflix' ? '📺' : service.name === 'HBO Max' ? '🎬' : '🎥'}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.price}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Watch
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
          <div className="space-y-3">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                      />
                    ))}
                  </div>
                  <span className="text-white/80 text-sm">{review.user}</span>
                </div>
                <p className="text-white/90 text-sm">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Comments</h2>
          <div className="space-y-3">
            {comments.map((comment, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold">{comment.user}</span>
                  <span className="text-white/60 text-xs">{comment.time}</span>
                </div>
                <p className="text-white/90 text-sm">{comment.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToWatchlist(movie.id)}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl p-4 font-semibold hover:opacity-90 transition-opacity"
          >
            Add to Watchlist
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSwipe('right', movie.id)}
            className="w-full bg-white/20 backdrop-blur-sm text-white rounded-xl p-4 font-semibold hover:bg-white/30 transition-colors border-2 border-white/30"
          >
            Like & Continue
          </motion.button>
        </div>
      </div>
    </div>
  )
}

