// APPROACH 2: Full Screen Overlay with Grid
// Full-screen modal with grid layout of groups
// Best for: Visual browsing, when you have many groups

import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockGroups } from '../../data/mockGroups'
import { FiX, FiUsers, FiCheck, FiPlus } from 'react-icons/fi'

export function GroupSelectionApproach2({ movie, onSelect, onClose }) {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-surface z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Add to Watchlist</h2>
            <p className="text-sm text-text-secondary mt-1">{movie?.title} ({movie?.year})</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-full transition-colors"
          >
            <FiX className="w-6 h-6 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          {mockGroups.map((group) => (
            <motion.button
              key={group.id}
              onClick={() => toggleGroup(group.id)}
              whileTap={{ scale: 0.95 }}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                selectedGroups.has(group.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-surface bg-surface hover:border-surface/80'
              }`}
            >
              {/* Check Badge */}
              {selectedGroups.has(group.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center"
                >
                  <FiCheck className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Group Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{ backgroundColor: `${group.color}20` }}
              >
                {group.avatar}
              </div>

              {/* Group Info */}
              <h3 className="font-semibold text-text-primary text-left mb-2">{group.name}</h3>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <FiUsers className="w-3 h-3" />
                <span>{group.members} members</span>
              </div>
            </motion.button>
          ))}

          {/* Create New Group */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-6 rounded-2xl border-2 border-dashed border-surface bg-surface/50 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[140px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
              <FiPlus className="w-8 h-8 text-primary" />
            </div>
            <span className="text-text-secondary font-medium">Create New</span>
          </motion.button>
        </div>
      </div>

      {/* Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-surface px-6 py-4">
        <button
          onClick={handleAdd}
          disabled={selectedGroups.size === 0}
          className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${
            selectedGroups.size > 0
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-surface text-text-muted cursor-not-allowed'
          }`}
        >
          Add to {selectedGroups.size > 0 ? `${selectedGroups.size} ` : ''}Watchlist{selectedGroups.size !== 1 ? 's' : ''}
        </button>
      </div>
    </motion.div>
  )
}

