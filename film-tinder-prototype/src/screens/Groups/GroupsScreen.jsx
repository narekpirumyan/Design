import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { TutorialGuide } from '../../components/TutorialGuide/TutorialGuide'
import { mockGroups } from '../../data/mockGroups'
import { mockMovies } from '../../data/mockMovies'
import { mockParticipants } from '../../utils/mockGroupState'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FiUsers, FiUser, FiMoreVertical, FiPlus, FiFilm } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { getTutorialSteps } from '../../data/tutorialSteps'

export function GroupsScreen() {
  const navigate = useNavigate()
  const { user, hasCompletedTutorial, completeTutorial, skipTutorial } = useAuth()
  const [activeTab, setActiveTab] = useState('groupes') // 'amis' or 'groupes'
  const [showTutorial, setShowTutorial] = useState(false)
  const swipeAreaRef = useRef(null)
  const dragX = useMotionValue(0)
  const startX = useRef(0)
  const startY = useRef(0)

  // Check if tutorial should be shown
  useEffect(() => {
    if (user && !hasCompletedTutorial('groups')) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setShowTutorial(true)
      }, 500)
    }
  }, [user, hasCompletedTutorial])
  
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
      if (deltaX > 0 && activeTab === 'amis') {
        // Swipe right: switch to groupes
        setActiveTab('groupes')
      } else if (deltaX < 0 && activeTab === 'groupes') {
        // Swipe left: switch to amis
        setActiveTab('amis')
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
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20 relative">
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
              data-tutorial-target="friends-tab"
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
              {/* Personal Watchlist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Navigate to personal watchlist view
                  // For now, we'll just show it as a special group
                }}
                className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow text-white"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                  <FiFilm className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">My Personal Watchlist</h3>
                  <p className="text-sm text-white/80 truncate">{mockMovies.slice(0, 3).length} movies saved</p>
                </div>
                <div className="flex gap-1">
                  {mockMovies.slice(0, 3).map((movie, idx) => (
                    <div
                      key={movie.id}
                      className="w-8 h-8 rounded overflow-hidden border-2 border-white/30"
                      style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
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
                    navigate(`/room/${group.id}`)
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
        </motion.div>
      </div>
      <BottomNavigation />
      
      {/* Tutorial Guide */}
      <TutorialGuide
        steps={getTutorialSteps('groups', user)}
        sectionId="groups"
        isActive={showTutorial}
        onComplete={(sectionId) => {
          completeTutorial(sectionId)
          setShowTutorial(false)
        }}
        onSkip={(sectionId) => {
          skipTutorial(sectionId)
          setShowTutorial(false)
        }}
      />
    </PhoneFrame>
  )
}

