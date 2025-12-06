import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { TutorialGuide } from '../../components/TutorialGuide/TutorialGuide'
import { motion } from 'framer-motion'
import { FiUser, FiSettings, FiLogOut, FiShield, FiFileText, FiMail } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { getTutorialSteps } from '../../data/tutorialSteps'

export function ProfileScreen() {
  const { user, updateInteractionModel, hasCompletedTutorial, completeTutorial, skipTutorial, logout } = useAuth()
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Check if tutorial should be shown
  useEffect(() => {
    if (user && !hasCompletedTutorial('profile')) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setShowTutorial(true)
      }, 500)
    }
  }, [user, hasCompletedTutorial])
  
  // Get current interaction model (default to 'swipe')
  const currentModel = user?.preferences?.interactionModel || 'swipe'
  
  // Mock profile data
  const stats = {
    moviesLiked: 42,
    groupsJoined: 5,
    watchlistCount: 12
  }

  const handleInteractionModelChange = (newModel) => {
    updateInteractionModel(newModel)
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-3xl">
                {user?.avatar || '👤'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-gray-600">{user?.email || '@username'}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="stats grid grid-cols-3 gap-4 mb-6">
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
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors"
              >
                <FiSettings className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-900">Interaction Mode</span>
              </button>
              
              <button 
                onClick={() => {
                  // Open privacy policy (could be a modal or external link)
                  alert('Privacy Policy - This would open the privacy policy page')
                }}
                className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors"
              >
                <FiShield className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-900">Privacy</span>
              </button>
              
              <button 
                onClick={() => {
                  // Open terms of service (could be a modal or external link)
                  alert('Terms of Service - This would open the terms page')
                }}
                className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors"
              >
                <FiFileText className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-900">Terms</span>
              </button>
              
              <button 
                onClick={() => {
                  // Open contact us (could be a modal or email)
                  window.location.href = 'mailto:support@filmtinder.com?subject=Contact Us'
                }}
                className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors"
              >
                <FiMail className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-900">Contact Us</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full p-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium flex items-center gap-3 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Interaction Mode Panel */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Interaction Style</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Choose how you want to browse movies
                    </p>
                    
                    {/* Tinder-like Swipe Option */}
                    <div 
                      onClick={() => handleInteractionModelChange('swipe')}
                      className={`flex items-center justify-between p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                        currentModel === 'swipe' ? 'bg-pink-50 border-2 border-pink-500' : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👆</span>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">Tinder-like Swipe</div>
                          <div className="text-xs text-gray-500">Swipe left to pass, right to like</div>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 ${
                        currentModel === 'swipe' ? 'bg-pink-500' : 'bg-gray-300'
                      }`}>
                        <motion.div 
                          className="w-5 h-5 rounded-full bg-white shadow-md"
                          animate={{
                            x: currentModel === 'swipe' ? 24 : 0
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>

                    {/* Instagram-like Scroll Option */}
                    <div 
                      onClick={() => handleInteractionModelChange('scroll')}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        currentModel === 'scroll' ? 'bg-pink-50 border-2 border-pink-500' : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">Instagram-like Scroll</div>
                          <div className="text-xs text-gray-500">Scroll vertically through movies like reels</div>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 ${
                        currentModel === 'scroll' ? 'bg-pink-500' : 'bg-gray-300'
                      }`}>
                        <motion.div 
                          className="w-5 h-5 rounded-full bg-white shadow-md"
                          animate={{
                            x: currentModel === 'scroll' ? 24 : 0
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <BottomNavigation />
      
      {/* Tutorial Guide */}
      <TutorialGuide
        steps={getTutorialSteps('profile', user)}
        sectionId="profile"
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

