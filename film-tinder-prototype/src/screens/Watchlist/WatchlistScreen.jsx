import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { mockMovies } from '../../data/mockMovies'
import { motion } from 'framer-motion'

export function WatchlistScreen() {
  // Mock watchlist - in real app this would come from state/API
  const watchlist = mockMovies.slice(0, 3)

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-3xl font-bold text-white">Ma liste</h1>
        </div>

        {/* Movies Grid */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {watchlist.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{movie.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

