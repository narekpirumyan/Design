import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../Button/Button'
import { generateRoomCode } from '../../utils/mockGroupState'
import { FiUsers, FiLogIn, FiX } from 'react-icons/fi'

export function CreateRoomModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode()
    navigate(`/room/${newRoomCode}`)
    onClose()
  }

  const handleJoinRoom = () => {
    const trimmedCode = roomCode.trim().toUpperCase()
    
    if (trimmedCode.length !== 6) {
      setError('Room code must be 6 characters')
      return
    }

    setError('')
    navigate(`/room/${trimmedCode}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 z-50"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden shadow-2xl"
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-red-600 via-pink-500 to-red-600 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Create or Join Room</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Create Room Card */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Room</h3>
                <p className="text-sm text-gray-600">Start a new movie selection session</p>
              </div>
            </div>
            <Button 
              onClick={handleCreateRoom}
              variant="primary"
              className="w-full"
            >
              Create New Room
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Join Room Card */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <FiLogIn className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Join Room</h3>
                <p className="text-sm text-gray-600">Enter a room code to join friends</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase().slice(0, 6))
                  setError('')
                }}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors font-mono text-center text-xl tracking-widest"
                maxLength={6}
              />
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </div>

            <Button 
              onClick={handleJoinRoom}
              variant="secondary"
              className="w-full"
              disabled={!roomCode.trim()}
            >
              Join Room
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

