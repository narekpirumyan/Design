export function ParticipantAvatar({ participant, isActive = false, showName = true }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`
        w-12 h-12 rounded-full
        flex items-center justify-center
        text-2xl
        border-2 transition-all bg-white/20 backdrop-blur-sm
        ${isActive ? 'border-white scale-110 ring-2 ring-white/50' : 'border-white/30'}
        ${participant.isCurrentUser ? 'ring-2 ring-white/50' : ''}
      `}>
        {participant.avatar}
      </div>
      {showName && (
        <span className="text-xs text-white/80 max-w-[60px] truncate">
          {participant.name}
        </span>
      )}
    </div>
  )
}

