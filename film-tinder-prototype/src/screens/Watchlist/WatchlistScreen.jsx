import { useState } from 'react'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { mockMovies } from '../../data/mockMovies'
import { mockGroups } from '../../data/mockGroups'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiPlus, FiChevronRight } from 'react-icons/fi'

export function WatchlistScreen() {
  const [selectedWatchlist, setSelectedWatchlist] = useState(null)

  // Mock watchlists - each can be shared with different groups
  const watchlists = [
    {
      id: 'wl1',
      name: 'My Personal Watchlist',
      sharedWith: [],
      movies: mockMovies.slice(0, 2),
      isPersonal: true
    },
    {
      id: 'wl2',
      name: 'Weekend Movie Night',
      sharedWith: [mockGroups[0].id],
      movies: mockMovies.slice(2, 4),
      groupName: mockGroups[0].name,
      groupAvatar: mockGroups[0].avatar
    },
    {
      id: 'wl3',
      name: 'Date Night Picks',
      sharedWith: [mockGroups[1].id],
      movies: mockMovies.slice(0, 1),
      groupName: mockGroups[1].name,
      groupAvatar: mockGroups[1].avatar
    }
  ]

  const currentWatchlist = selectedWatchlist 
    ? watchlists.find(w => w.id === selectedWatchlist)
    : null

  if (currentWatchlist) {
    return (
      <PhoneFrame>
        <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20 relative">
          {/* Header with Back */}
          <div className="px-6 pt-12 pb-6">
            <button
              onClick={() => setSelectedWatchlist(null)}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2"
            >
              <FiChevronRight className="w-5 h-5 rotate-180" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-white">{currentWatchlist.name}</h1>
            {currentWatchlist.sharedWith.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <FiUsers className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-sm">Shared with {currentWatchlist.groupName}</span>
              </div>
            )}
          </div>

          {/* Movies Grid */}
          <div className="px-4 pb-6">
            {currentWatchlist.movies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {currentWatchlist.movies.map((movie, idx) => (
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
            ) : (
              <div className="text-center py-12 text-white/80">
                <p>No movies in this watchlist yet</p>
              </div>
            )}
          </div>
        </div>
        <BottomNavigation />
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20 relative">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-3xl font-bold text-white">Ma liste</h1>
        </div>

        {/* Watchlists List */}
        <div className="px-6 pb-6 space-y-3">
          {watchlists.map((watchlist, idx) => (
            <motion.button
              key={watchlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedWatchlist(watchlist.id)}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-xl flex-shrink-0">
                {watchlist.isPersonal ? '📽️' : watchlist.groupAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{watchlist.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {watchlist.sharedWith.length > 0 ? (
                    <>
                      <FiUsers className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500 truncate">Shared with {watchlist.groupName}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Personal watchlist</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{watchlist.movies.length} movies</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </motion.button>
          ))}

          {/* Create New Watchlist */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: watchlists.length * 0.05 }}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
              <FiPlus className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Create New Watchlist</h3>
              <p className="text-sm text-gray-500">Start a new shared watchlist</p>
            </div>
          </motion.button>
        </div>
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

