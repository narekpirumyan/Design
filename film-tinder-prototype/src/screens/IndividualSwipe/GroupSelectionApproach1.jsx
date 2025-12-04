// APPROACH 1: Bottom Sheet Modal
// Modern, mobile-friendly bottom sheet that slides up from bottom
// Best for: Quick selection, familiar mobile pattern

import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockGroups } from '../../data/mockGroups'
import { FiX, FiUsers, FiCheck } from 'react-icons/fi'

export function GroupSelectionApproach1({ movie, onSelect, onClose }) {
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl z-50 max-h-[80vh] overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-text-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-surface">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-text-primary">Add to Watchlist</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          <p className="text-sm text-text-secondary">{movie?.title} ({movie?.year})</p>
        </div>

        {/* Groups List */}
        <div className="overflow-y-auto max-h-[60vh] px-6 py-4">
          <div className="space-y-3">
            {mockGroups.map((group) => (
              <motion.button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedGroups.has(group.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-surface bg-background hover:border-surface/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    {group.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-text-primary">{group.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                      <FiUsers className="w-4 h-4" />
                      <span>{group.members} members</span>
                      <span>•</span>
                      <span>{group.lastActive}</span>
                    </div>
                  </div>
                  {selectedGroups.has(group.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <FiCheck className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 border-t border-surface bg-surface">
          <button
            onClick={handleAdd}
            disabled={selectedGroups.size === 0}
            className={`w-full py-3 rounded-full font-semibold transition-all ${
              selectedGroups.size > 0
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-surface text-text-muted cursor-not-allowed'
            }`}
          >
            Add to {selectedGroups.size > 0 ? `${selectedGroups.size} ` : ''}Watchlist{selectedGroups.size !== 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </>
  )
}

