import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlus, FiCheck } from 'react-icons/fi'
import { CustomMoodForm } from '../CustomMoodForm/CustomMoodForm'

// Pre-created moods (as if user already created them)
const defaultMoods = [
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    description: 'Fast-paced, thrilling movies',
    color: '#FF6B6B'
  },
  {
    id: 'relaxed',
    name: 'Relaxed',
    emoji: '😌',
    description: 'Calm and easy-going films',
    color: '#4ECDC4'
  },
  {
    id: 'thoughtful',
    name: 'Thoughtful',
    emoji: '🤔',
    description: 'Deep, meaningful stories',
    color: '#95E1D3'
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    emoji: '🗺️',
    description: 'Exploring new worlds',
    color: '#F38181'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    description: 'Love stories and romance',
    color: '#FFB6C1'
  },
  {
    id: 'funny',
    name: 'Funny',
    emoji: '😂',
    description: 'Comedy and laughs',
    color: '#FFD93D'
  }
]

export function MoodSelectionModal({ isOpen, onClose, onSelectMood, currentMood }) {
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [userMoods, setUserMoods] = useState(() => {
    // Load user's custom moods from localStorage
    const saved = localStorage.getItem('userMoods')
    return saved ? JSON.parse(saved) : []
  })

  const allMoods = [...defaultMoods, ...userMoods]

  const handleSelectMood = (mood) => {
    onSelectMood(mood)
    onClose()
  }

  const handleSaveCustomMood = (customMood) => {
    const newMood = {
      id: `custom_${Date.now()}`,
      ...customMood,
      isCustom: true
    }
    const updated = [...userMoods, newMood]
    setUserMoods(updated)
    localStorage.setItem('userMoods', JSON.stringify(updated))
    handleSelectMood(newMood)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-[10000] flex items-center justify-center p-4"
        onClick={(e) => {
          // Allow closing by clicking backdrop if there's a current mood
          if (currentMood) {
            onClose()
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-[340px] max-h-[600px] overflow-hidden flex flex-col"
          style={{
            maxWidth: '340px',
            maxHeight: '600px'
          }}
        >
          {!showCustomForm ? (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Choose Your Mood</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  Select a mood to personalize your movie recommendations
                </p>
              </div>

              {/* Moods Grid */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                  {allMoods.map((mood) => {
                    const isSelected = currentMood?.id === mood.id
                    return (
                      <motion.button
                        key={mood.id}
                        onClick={() => handleSelectMood(mood)}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                        }`}
                        style={{
                          borderColor: isSelected ? mood.color : undefined
                        }}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: mood.color }}
                            >
                              <FiCheck className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="text-2xl mb-1">{mood.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">{mood.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-tight">{mood.description}</div>
                        {mood.isCustom && (
                          <div className="text-xs text-pink-600 mt-0.5 font-medium">Custom</div>
                        )}
                      </motion.button>
                    )
                  })}

                  {/* Create Custom Mood Button */}
                  <motion.button
                    onClick={() => setShowCustomForm(true)}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50/50 transition-all flex flex-col items-center justify-center min-h-[100px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-1.5">
                      <FiPlus className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="font-semibold text-gray-900 text-xs">Create Custom</div>
                    <div className="text-xs text-gray-500 mt-0.5">New mood</div>
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <CustomMoodForm
              onSave={handleSaveCustomMood}
              onCancel={() => setShowCustomForm(false)}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

