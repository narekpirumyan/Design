import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { motion } from 'framer-motion'
import { FiUser, FiSettings, FiHeart, FiUsers } from 'react-icons/fi'

export function ProfileScreen() {
  // Mock profile data
  const stats = {
    moviesLiked: 42,
    groupsJoined: 5,
    watchlistCount: 12
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Name</h2>
                <p className="text-gray-600">@username</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.moviesLiked}</div>
                <div className="text-sm text-gray-600">Liked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.groupsJoined}</div>
                <div className="text-sm text-gray-600">Groups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.watchlistCount}</div>
                <div className="text-sm text-gray-600">Watchlist</div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                <FiHeart className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-900">My Watchlist</span>
              </button>
              <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                <FiUsers className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-900">My Groups</span>
              </button>
              <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                <FiSettings className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-900">Settings</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

