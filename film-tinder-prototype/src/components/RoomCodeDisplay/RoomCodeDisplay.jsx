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
    <div className="flex items-center gap-2 bg-surface/50 rounded-lg px-4 py-2">
      <span className="text-sm text-text-muted">Room Code:</span>
      <span className="font-mono font-bold text-lg text-primary">{roomCode}</span>
      <button
        onClick={handleCopy}
        className="ml-2 p-1 hover:bg-surface rounded transition-colors"
        aria-label="Copy room code"
      >
        {copied ? (
          <FiCheck className="w-4 h-4 text-success" />
        ) : (
          <FiCopy className="w-4 h-4 text-text-secondary" />
        )}
      </button>
    </div>
  )
}

