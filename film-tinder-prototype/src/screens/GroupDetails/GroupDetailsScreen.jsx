import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { BackButton } from '../../components/BackButton/BackButton'
import { TutorialGuide } from '../../components/TutorialGuide/TutorialGuide'
import { mockGroups } from '../../data/mockGroups'
import { mockMovies } from '../../data/mockMovies'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiFilm, FiUsers, FiClock, FiPlay } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { getTutorialSteps } from '../../data/tutorialSteps'

// Mock data for group movies (with who added them)
const mockGroupMovies = [
  {
    movie: mockMovies[0], // Inception
    addedBy: { id: 'user1', name: 'Alex', avatar: '👨' },
    addedAt: '2 days ago'
  },
  {
    movie: mockMovies[1], // Grand Budapest Hotel
    addedBy: { id: 'user2', name: 'Sarah', avatar: '👩' },
    addedAt: '3 days ago'
  },
  {
    movie: mockMovies[2], // Parasite
    addedBy: { id: 'user1', name: 'Alex', avatar: '👨' },
    addedAt: '5 days ago'
  },
  {
    movie: mockMovies[3], // Spirited Away
    addedBy: { id: 'user3', name: 'Mike', avatar: '🧑' },
    addedAt: '1 week ago'
  },
  {
    movie: mockMovies[4], // Mad Max
    addedBy: { id: 'user2', name: 'Sarah', avatar: '👩' },
    addedAt: '1 week ago'
  }
]

// Mock data for group members
const mockGroupMembers = [
  { id: 'user1', name: 'Alex Martin', avatar: '👨', status: 'online', role: 'admin' },
  { id: 'user2', name: 'Sarah Johnson', avatar: '👩', status: 'online', role: 'member' },
  { id: 'user3', name: 'Mike Chen', avatar: '🧑', status: 'offline', role: 'member' },
  { id: 'user4', name: 'Emma Wilson', avatar: '👱‍♀️', status: 'offline', role: 'member' }
]

// Mock data for film sessions (history)
const mockFilmSessions = [
  {
    id: 'session1',
    movie: mockMovies[0], // Inception
    watchedAt: '1 week ago',
    participants: mockGroupMembers.slice(0, 3),
    rating: 4.5,
    duration: '2h 28m'
  },
  {
    id: 'session2',
    movie: mockMovies[1], // Grand Budapest Hotel
    watchedAt: '2 weeks ago',
    participants: mockGroupMembers.slice(0, 4),
    rating: 4.8,
    duration: '1h 40m'
  },
  {
    id: 'session3',
    movie: mockMovies[2], // Parasite
    watchedAt: '3 weeks ago',
    participants: mockGroupMembers.slice(0, 2),
    rating: 5.0,
    duration: '2h 12m'
  }
]

export function GroupDetailsScreen() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { user, hasCompletedTutorial, completeTutorial, skipTutorial } = useAuth()
  const [activeTab, setActiveTab] = useState('movies') // 'movies', 'members', 'sessions'
  const [showTutorial, setShowTutorial] = useState(false)

  // Find the group
  const group = mockGroups.find(g => g.id === groupId)

  // Check if tutorial should be shown on first visit
  useEffect(() => {
    if (!user) {
      setShowTutorial(false)
      return
    }
    
    if (!hasCompletedTutorial('groupDetails')) {
      // Small delay to ensure smooth screen transition
      const timer = setTimeout(() => {
        setShowTutorial(true)
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setShowTutorial(false)
    }
  }, [user, hasCompletedTutorial])

  if (!group) {
    return (
      <PhoneFrame>
        <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Group not found</h2>
            <button
              onClick={() => navigate('/groups')}
              className="mt-4 px-6 py-2 bg-white text-red-600 rounded-xl font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </PhoneFrame>
    )
  }

  const handleStartSession = () => {
    navigate(`/room/${groupId}`)
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col overflow-hidden pb-20">
        {/* Header */}
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <BackButton variant="minimal" />
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${group.color}40` }}
            >
              {group.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{group.name}</h1>
              <p className="text-white/70 text-sm">{group.members} members</p>
            </div>
          </div>

          {/* Start Session Button */}
          <motion.button
            onClick={handleStartSession}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-red-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-white/95 transition-colors"
            data-tutorial-target="start-session"
          >
            <FiPlay className="w-5 h-5" />
            Start Movie Session
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4">
          <div className="flex gap-4 border-b border-white/30">
            <button
              onClick={() => setActiveTab('movies')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'movies'
                  ? 'text-white'
                  : 'text-white/60'
              }`}
              data-tutorial-target="movies-tab"
            >
              <span className="flex items-center gap-2">
                <FiFilm className="w-4 h-4" />
                Movies
              </span>
              {activeTab === 'movies' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'members'
                  ? 'text-white'
                  : 'text-white/60'
              }`}
              data-tutorial-target="members-tab"
            >
              <span className="flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                Members
              </span>
              {activeTab === 'members' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'sessions'
                  ? 'text-white'
                  : 'text-white/60'
              }`}
              data-tutorial-target="history-tab"
            >
              <span className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                History
              </span>
              {activeTab === 'sessions' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'movies' && (
              <motion.div
                key="movies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {mockGroupMovies.map((item, idx) => (
                  <motion.div
                    key={item.movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl p-4 flex items-center gap-4"
                  >
                    <img
                      src={item.movie.poster}
                      alt={item.movie.title}
                      className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.movie.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.movie.year}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {item.addedBy.avatar}
                        </div>
                        <span className="text-xs text-gray-500">
                          Added by {item.addedBy.name} • {item.addedAt}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {mockGroupMembers.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                        {member.avatar}
                      </div>
                      {member.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {member.name}
                        </h3>
                        {member.role === 'admin' && (
                          <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {member.status === 'online' ? 'Active now' : 'Offline'}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Add Member Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mockGroupMembers.length * 0.05 }}
                  className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <FiPlus className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">Add Member</h3>
                    <p className="text-sm text-gray-500">Invite friends to join this group</p>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {activeTab === 'sessions' && (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {mockFilmSessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl p-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={session.movie.poster}
                        alt={session.movie.title}
                        className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {session.movie.title}
                        </h3>
                        <p className="text-sm text-gray-600">{session.movie.year}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-700 font-medium">
                              {session.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{session.duration}</span>
                          <span className="text-xs text-gray-500">{session.watchedAt}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex -space-x-2">
                            {session.participants.map((participant) => (
                              <div
                                key={participant.id}
                                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
                                title={participant.name}
                              >
                                {participant.avatar}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {session.participants.length} watched together
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {mockFilmSessions.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No sessions yet. Start watching together!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <BottomNavigation />

      {/* Tutorial Guide */}
      {showTutorial && (
        <TutorialGuide
          steps={getTutorialSteps('groupDetails', user)}
          sectionId="groupDetails"
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
      )}
    </PhoneFrame>
  )
}

