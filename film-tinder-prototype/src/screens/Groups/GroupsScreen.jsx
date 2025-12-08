import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { TutorialGuide } from '../../components/TutorialGuide/TutorialGuide'
import { mockGroups } from '../../data/mockGroups'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants } from '../../utils/mockGroupState'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { FiUsers, FiUser, FiMoreVertical, FiPlus, FiFilm, FiX } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { getTutorialSteps } from '../../data/tutorialSteps'

export function GroupsScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('groups') // 'friends' or 'groups'
  const [showPersonalWatchlist, setShowPersonalWatchlist] = useState(false)
  const swipeAreaRef = useRef(null)
  const dragX = useMotionValue(0)
  const startX = useRef(0)
  const startY = useRef(0)

  // Personal watchlist - use all movies to ensure it's not empty
  const personalWatchlistMovies = [...mockMovies]
  
  // Handle swipe gesture for tab switching
  const handleDragStart = (event, info) => {
    startX.current = info.point.x
    startY.current = info.point.y
  }
  
  const handleDragEnd = (event, info) => {
    const deltaX = info.point.x - startX.current
    const deltaY = Math.abs(info.point.y - startY.current)
    const threshold = 50 // Minimum drag distance to switch tabs
    
    // Only switch if horizontal movement is greater than vertical (horizontal swipe)
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0 && activeTab === 'friends') {
        // Swipe right: switch to groups
        setActiveTab('groups')
      } else if (deltaX < 0 && activeTab === 'groups') {
        // Swipe left: switch to friends
        setActiveTab('friends')
      }
    }
    dragX.set(0)
  }

  // Mock friends data
  const mockFriends = [
    {
      id: 'friend1',
      name: 'Alex Martin',
      avatar: '👨',
      status: 'online',
      lastActive: 'Active now'
    },
    {
      id: 'friend2',
      name: 'Sarah Johnson',
      avatar: '👩',
      status: 'offline',
      lastActive: '2 hours ago'
    },
    {
      id: 'friend3',
      name: 'Mike Chen',
      avatar: '🧑',
      status: 'online',
      lastActive: 'Active now'
    },
    {
      id: 'friend4',
      name: 'Emma Wilson',
      avatar: '👱‍♀️',
      status: 'offline',
      lastActive: '1 day ago'
    }
  ]

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20 relative" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          ref={swipeAreaRef}
          className="h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragDirectionLock
          onDragStart={handleDragStart}
          onDrag={(event, info) => {
            // Only track horizontal drags if they're more horizontal than vertical
            if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
              dragX.set(info.offset.x)
            }
          }}
          onDragEnd={handleDragEnd}
          style={{ x: useTransform(dragX, (val) => val) }}
        >
        {/* Header */}
        <div className="px-6 pt-12 pb-4">
          <h1 className="text-3xl font-bold text-white">Who are we sharing popcorn with?</h1>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4">
          <div className="flex gap-6 border-b border-white/30">
            <button
              onClick={() => setActiveTab('friends')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60'
              }`}
              data-tutorial-target="friends-tab"
            >
              Friends
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60'
              }`}
            >
              Groups
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {activeTab === 'groups' && (
            <div className="space-y-3">
              {/* Personal Watchlist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowPersonalWatchlist(true)
                }}
                className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 cursor-pointer hover:shadow-lg transition-shadow text-white"
                data-tutorial-target="personal-watchlist"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  <FiFilm className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-sm sm:text-base">My Personal Watchlist</h3>
                  <p className="text-xs sm:text-sm text-white/80 truncate">{personalWatchlistMovies.length} movies saved</p>
                </div>
                <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                  {personalWatchlistMovies.slice(0, 3).map((movie, idx) => (
                    <div
                      key={movie.id}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded overflow-hidden border-2 border-white/30"
                      style={{ marginLeft: idx > 0 ? '-6px' : '0' }}
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
                        }}
                      />
                    </div>
                  ))}
                  {personalWatchlistMovies.length > 3 && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-white/20 border-2 border-white/30 flex items-center justify-center text-[10px] sm:text-xs font-semibold">
                      +{personalWatchlistMovies.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>

              {mockGroups.map((group, idx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(`/group/${group.id}`)
                  }}
                  className="group-card bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    {group.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                    <p className="text-sm text-gray-500 truncate">Group description</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Menu would open here
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <FiMoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </motion.div>
              ))}

              {/* Create New Group Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mockGroups.length * 0.05 }}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300"
                data-tutorial-target="create-group"
              >
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <FiPlus className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Create New Group</h3>
                  <p className="text-sm text-gray-500">Start a new watchlist</p>
                </div>
              </motion.button>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-3">
              {mockFriends.map((friend, idx) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                      {friend.avatar}
                    </div>
                    {friend.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{friend.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{friend.lastActive}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Menu would open here
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <FiMoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </motion.div>
              ))}

              {/* Add Friend Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mockFriends.length * 0.05 }}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300"
              >
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <FiPlus className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Add Friend</h3>
                  <p className="text-sm text-gray-500">Invite friends to join</p>
                </div>
              </motion.button>
            </div>
          )}
        </div>
        </motion.div>
      </div>
      <BottomNavigation />
      

      {/* Personal Watchlist Modal */}
      <AnimatePresence>
        {showPersonalWatchlist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowPersonalWatchlist(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md max-h-[90vh] sm:max-h-[80vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 sm:p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <h2 className="text-lg sm:text-2xl font-bold">My Personal Watchlist</h2>
                  <button
                    onClick={() => setShowPersonalWatchlist(false)}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                  >
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="text-white/80 text-xs sm:text-sm">{personalWatchlistMovies.length} movies</p>
              </div>

              {/* Movies List */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {personalWatchlistMovies.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {personalWatchlistMovies.map((movie) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-[4.5rem] sm:w-16 sm:h-24 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {movie.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">{movie.year}</p>
                          <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                            {movie.vibeTags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-pink-100 text-pink-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-500 text-sm sm:text-base">No movies in your watchlist yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  )
}

