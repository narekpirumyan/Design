export function ParticipantAvatar({ participant, isActive = false, showName = true }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`
        w-12 h-12 rounded-full
        flex items-center justify-center
        text-2xl
        border-2 transition-all
        ${isActive ? 'border-primary scale-110' : 'border-surface'}
        ${participant.isCurrentUser ? 'ring-2 ring-primary/50' : ''}
      `}>
        {participant.avatar}
      </div>
      {showName && (
        <span className="text-xs text-text-secondary max-w-[60px] truncate">
          {participant.name}
        </span>
      )}
    </div>
  )
}

