// APPROACH 1: Bottom Sheet Modal
// Modern, mobile-friendly bottom sheet that slides up from bottom
// Best for: Quick selection, familiar mobile pattern

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockGroups } from '../../data/mockGroups'
import { FiX, FiUsers, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi'

export function GroupSelectionApproach1({ movie, onSelect, onClose }) {
  const [selectedGroups, setSelectedGroups] = useState(new Set())
  const [showAllGroups, setShowAllGroups] = useState(false)
  const [activeTab, setActiveTab] = useState('groupes') // 'amis' or 'groupes'

  // Show only first 3 groups initially
  const displayedGroups = showAllGroups ? mockGroups : mockGroups.slice(0, 3)

  const toggleGroup = (groupId) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const handleAdd = () => {
    selectedGroups.forEach(groupId => onSelect(groupId))
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 z-40"
      />

      {/* Bottom Sheet - positioned relative to phone frame */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden shadow-2xl"
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-red-600 via-pink-500 to-red-600 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">On partage le pop corn avec qui?</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Tabs */}
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

        {/* Groups List */}
        <div className="overflow-y-auto max-h-[50vh] bg-white">
          <div className="px-6 py-4">
            <div className="space-y-3">
              {activeTab === 'groupes' && (
                <>
                  {displayedGroups.map((group) => (
                    <motion.button
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedGroups.has(group.id)
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 bg-white hover:border-pink-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: `${group.color}20` }}
                        >
                          {group.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900">{group.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">description</p>
                        </div>
                        {selectedGroups.has(group.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0"
                          >
                            <FiCheck className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}

                  {/* Show More/Less Button */}
                  {mockGroups.length > 3 && (
                    <button
                      onClick={() => setShowAllGroups(!showAllGroups)}
                      className="w-full py-3 text-pink-500 font-medium flex items-center justify-center gap-2 hover:bg-pink-50 rounded-xl transition-colors"
                    >
                      {showAllGroups ? (
                        <>
                          <FiChevronUp className="w-5 h-5" />
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                          <FiChevronDown className="w-5 h-5" />
                          <span>Show More ({mockGroups.length - 3} more)</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              )}

              {activeTab === 'amis' && (
                <div className="text-center py-8 text-gray-500">
                  <p>No friends available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleAdd}
            disabled={selectedGroups.size === 0}
            className={`w-full py-3 rounded-full font-semibold transition-all ${
              selectedGroups.size > 0
                ? 'bg-gradient-to-r from-red-600 to-pink-500 text-white hover:opacity-90 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Ajouter {selectedGroups.size > 0 ? `(${selectedGroups.size})` : ''}
          </button>
        </div>
      </motion.div>
    </>
  )
}

