import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiFilm, FiUsers, FiPlus, FiList, FiUser } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { CreateRoomModal } from '../CreateRoomModal/CreateRoomModal'

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const navItems = [
    {
      id: 'swipe',
      icon: FiFilm,
      label: 'Swipe',
      path: '/swipe',
      active: location.pathname === '/swipe'
    },
    {
      id: 'groups',
      icon: FiUsers,
      label: 'Groups',
      path: '/groups',
      active: location.pathname === '/groups' || location.pathname.startsWith('/room') || location.pathname.startsWith('/match')
    },
    {
      id: 'create',
      icon: FiPlus,
      label: 'Create',
      path: '/',
      isAction: true,
      active: false
    },
    {
      id: 'watchlist',
      icon: FiList,
      label: 'Watchlist',
      path: '/watchlist',
      active: location.pathname === '/watchlist'
    },
    {
      id: 'profile',
      icon: FiUser,
      label: 'Profile',
      path: '/profile',
      active: location.pathname === '/profile'
    }
  ]

  const handleNavClick = (item) => {
    if (item.isAction) {
      // Open create room modal
      setShowCreateModal(true)
    } else {
      navigate(item.path)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-800 via-red-700 to-red-600 border-t border-red-900/50 z-50">
      <div className="px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.active || (item.isAction && false)
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                whileTap={{ scale: 0.9 }}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10">
                  {item.isAction ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  )}
                </div>

                {/* Label */}
                {!item.isAction && (
                  <span className={`text-xs relative z-10 ${isActive ? 'text-white font-medium' : 'text-white/60'}`}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
      <AnimatePresence>
        {showCreateModal && (
          <CreateRoomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

