import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { generateRoomCode } from '../../utils/mockGroupState'
import { FiUsers, FiLogIn } from 'react-icons/fi'

export function CreateJoinRoomScreen() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode()
    navigate(`/room/${newRoomCode}`)
  }

  const handleJoinRoom = () => {
    const trimmedCode = roomCode.trim().toUpperCase()
    
    // Minimal validation - just check length
    if (trimmedCode.length !== 6) {
      setError('Room code must be 6 characters')
      return
    }

    setError('')
    navigate(`/room/${trimmedCode}`)
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Film Tinder</h1>
          <p className="text-white/90 text-lg">
            Find movies your whole group will love
          </p>
        </div>

        {/* Create Room Card */}
        <div className="bg-white rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Room</h2>
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
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-white/80 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        {/* Join Room Card */}
        <div className="bg-white rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <FiLogIn className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Join Room</h2>
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors font-mono text-center text-xl tracking-widest"
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

        {/* Info */}
        <p className="text-center text-white/80 text-sm">
          Swipe right to like, left to pass. Find movies everyone loves!
        </p>

        {/* Individual Browse Link */}
        <div className="pt-4">
          <button
            onClick={() => navigate('/swipe')}
            className="w-full py-3 text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            Browse movies individually →
          </button>
        </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

