import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

export function RoomCodeDisplay({ roomCode, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    if (onCopy) onCopy()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
      <span className="text-sm text-white/80">Room Code:</span>
      <span className="font-mono font-bold text-lg text-white">{roomCode}</span>
      <button
        onClick={handleCopy}
        className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Copy room code"
      >
        {copied ? (
          <FiCheck className="w-4 h-4 text-green-300" />
        ) : (
          <FiCopy className="w-4 h-4 text-white/80" />
        )}
      </button>
    </div>
  )
}

