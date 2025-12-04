// APPROACH 3: Slide-in Panel from Right
// Side panel that slides in from the right edge
// Best for: Quick access without blocking the view completely

import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockGroups } from '../../data/mockGroups'
import { FiX, FiUsers, FiCheck, FiSearch } from 'react-icons/fi'

export function GroupSelectionApproach3({ movie, onSelect, onClose }) {
  const [selectedGroups, setSelectedGroups] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Slide Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-surface z-50 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface bg-surface">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Add to Watchlist</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          <p className="text-sm text-text-secondary mb-4">{movie?.title} ({movie?.year})</p>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search watchlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-surface rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="overflow-y-auto h-[calc(100vh-200px)] px-6 py-4">
          <div className="space-y-2">
            {filteredGroups.map((group) => (
              <motion.button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-lg border transition-all ${
                  selectedGroups.has(group.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-surface bg-background hover:border-surface/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    {group.avatar}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-medium text-text-primary truncate">{group.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                      <FiUsers className="w-3 h-3" />
                      <span>{group.members} members</span>
                    </div>
                  </div>
                  {selectedGroups.has(group.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                    >
                      <FiCheck className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-surface bg-surface">
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

