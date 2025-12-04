// APPROACH 5: Quick Select Chips
// Minimal overlay with quick-select chips at bottom
// Best for: Fast selection, when you have few groups, minimal interruption

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockGroups } from '../../data/mockGroups'
import { FiX, FiCheck } from 'react-icons/fi'

export function GroupSelectionApproach5({ movie, onSelect, onClose }) {
  const [selectedGroups, setSelectedGroups] = useState(new Set())

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
      {/* Subtle Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Quick Select Panel */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t-2 border-primary/30 z-50 rounded-t-3xl shadow-2xl"
      >
        {/* Movie Info Bar */}
        <div className="px-6 pt-4 pb-3 border-b border-surface/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted">Adding to watchlist</p>
              <p className="text-lg font-semibold text-text-primary truncate">{movie?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-full transition-colors ml-4"
            >
              <FiX className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Quick Select Chips */}
        <div className="px-6 py-4">
          <p className="text-sm text-text-muted mb-3">Select watchlists:</p>
          <div className="flex flex-wrap gap-2">
            {mockGroups.map((group) => (
              <motion.button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2.5 rounded-full border-2 transition-all flex items-center gap-2 ${
                  selectedGroups.has(group.id)
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-surface bg-background text-text-secondary hover:border-primary/50'
                }`}
              >
                <span className="text-lg">{group.avatar}</span>
                <span className="font-medium text-sm">{group.name}</span>
                <AnimatePresence>
                  {selectedGroups.has(group.id) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="ml-1"
                    >
                      <FiCheck className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={handleAdd}
            disabled={selectedGroups.size === 0}
            className={`w-full py-3.5 rounded-full font-semibold transition-all ${
              selectedGroups.size > 0
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30'
                : 'bg-surface text-text-muted cursor-not-allowed'
            }`}
          >
            {selectedGroups.size > 0
              ? `Add to ${selectedGroups.size} Watchlist${selectedGroups.size !== 1 ? 's' : ''}`
              : 'Select a watchlist'}
          </button>
        </div>
      </motion.div>
    </>
  )
}

