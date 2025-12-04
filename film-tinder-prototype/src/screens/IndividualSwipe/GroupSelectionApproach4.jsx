// APPROACH 4: Centered Popup Modal with Search
// Classic centered modal with search and filter
// Best for: Desktop-friendly, when you need search functionality

import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockGroups } from '../../data/mockGroups'
import { FiX, FiUsers, FiCheck, FiSearch, FiFilter } from 'react-icons/fi'

export function GroupSelectionApproach4({ movie, onSelect, onClose }) {
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      {/* Centered Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-surface rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-text-primary">Add to Watchlist</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          <p className="text-sm text-text-secondary mb-4">{movie?.title} ({movie?.year})</p>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search watchlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-surface rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="overflow-y-auto max-h-[50vh] px-6 py-4">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <p>No watchlists found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredGroups.map((group) => (
                <motion.button
                  key={group.id}
                  onClick={() => toggleGroup(group.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedGroups.has(group.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-surface bg-background hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
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
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                      >
                        <FiCheck className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-surface bg-surface flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full font-semibold border-2 border-surface text-text-secondary hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedGroups.size === 0}
            className={`flex-1 py-3 rounded-full font-semibold transition-all ${
              selectedGroups.size > 0
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-surface text-text-muted cursor-not-allowed'
            }`}
          >
            Add{selectedGroups.size > 0 ? ` (${selectedGroups.size})` : ''}
          </button>
        </div>
      </motion.div>
    </>
  )
}

