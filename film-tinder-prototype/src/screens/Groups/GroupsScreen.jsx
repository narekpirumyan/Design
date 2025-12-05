import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { mockGroups } from '../../data/mockGroups'
import { mockParticipants } from '../../utils/mockGroupState'
import { motion } from 'framer-motion'
import { FiUsers, FiUser, FiMoreVertical, FiPlus } from 'react-icons/fi'

export function GroupsScreen() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('groupes') // 'amis' or 'groupes'

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
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20 relative">
        {/* Header */}
        <div className="px-6 pt-12 pb-4">
          <h1 className="text-3xl font-bold text-white">On partage le pop corn avec qui?</h1>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4">
          <div className="flex gap-6 border-b border-white/30">
            <button
              onClick={() => setActiveTab('amis')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'amis'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60'
              }`}
            >
              Amis
            </button>
            <button
              onClick={() => setActiveTab('groupes')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'groupes'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60'
              }`}
            >
              Groupes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {activeTab === 'groupes' && (
            <div className="space-y-3">
              {mockGroups.map((group, idx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/room/${group.id}`)}
                  className="bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    {group.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                    <p className="text-sm text-gray-500 truncate">description</p>
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

          {activeTab === 'amis' && (
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
      </div>
      <BottomNavigation />
    </PhoneFrame>
  )
}

