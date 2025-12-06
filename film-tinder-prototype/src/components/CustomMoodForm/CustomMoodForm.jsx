import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'

const emojis = ['😊', '😎', '😴', '🤩', '😍', '🤪', '😇', '😈', '🎭', '🎪', '🎨', '🎬', '🎯', '🎲', '🎸', '🎺']

export function CustomMoodForm({ onSave, onCancel }) {
  const [moodName, setMoodName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('😊')
  const [description, setDescription] = useState('')
  const [intensity, setIntensity] = useState(5) // 1-10
  const [energy, setEnergy] = useState(5) // 1-10
  const [seriousness, setSeriousness] = useState(5) // 1-10
  const [color, setColor] = useState('#FF6B6B')

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', 
    '#FFB6C1', '#FFD93D', '#A8E6CF', '#FF8B94',
    '#C7CEEA', '#FFAAA5', '#FFD3A5', '#FD9853'
  ]

  const handleSave = () => {
    if (!moodName.trim()) {
      alert('Please enter a mood name')
      return
    }

    onSave({
      name: moodName,
      emoji: selectedEmoji,
      description: description || `${moodName} mood`,
      color,
      intensity,
      energy,
      seriousness
    })
  }

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Create Custom Mood</h2>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Customize your mood with sliders and preferences
        </p>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 min-h-0">
        {/* Mood Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mood Name *
          </label>
          <input
            type="text"
            value={moodName}
            onChange={(e) => setMoodName(e.target.value)}
            placeholder="e.g., Cozy Evening"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Emoji Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Choose Emoji
          </label>
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`p-3 rounded-xl text-2xl transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-pink-100 border-2 border-pink-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this mood"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Intensity Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Intensity
            </label>
            <span className="text-sm text-gray-500">{intensity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Calm</span>
            <span>Intense</span>
          </div>
        </div>

        {/* Energy Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Energy Level
            </label>
            <span className="text-sm text-gray-500">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Relaxed</span>
            <span>Energetic</span>
          </div>
        </div>

        {/* Seriousness Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Seriousness
            </label>
            <span className="text-sm text-gray-500">{seriousness}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={seriousness}
            onChange={(e) => setSeriousness(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Fun</span>
            <span>Serious</span>
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Color Theme
          </label>
          <div className="grid grid-cols-6 gap-2">
            {colorOptions.map((col) => (
              <button
                key={col}
                onClick={() => setColor(col)}
                className={`w-12 h-12 rounded-xl transition-all ${
                  color === col
                    ? 'ring-4 ring-pink-500 ring-offset-2'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <FiCheck className="w-5 h-5" />
          Create Mood
        </motion.button>
      </div>
    </div>
  )
}

