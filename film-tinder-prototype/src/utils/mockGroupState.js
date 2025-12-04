// Mock participants for group rooms
export const mockParticipants = [
  {
    id: 'user1',
    name: 'You',
    avatar: '👤',
    isCurrentUser: true
  },
  {
    id: 'user2',
    name: 'Alex',
    avatar: '👨',
    isCurrentUser: false
  },
  {
    id: 'user3',
    name: 'Sam',
    avatar: '👩',
    isCurrentUser: false
  },
  {
    id: 'user4',
    name: 'Jordan',
    avatar: '🧑',
    isCurrentUser: false
  }
]

// Generate a random room code
export function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Match detection logic
export function findMatches(swipes, participants) {
  // Group swipes by movie ID
  const movieSwipes = {}
  
  swipes.forEach(swipe => {
    if (swipe.direction === 'right') { // Only count likes
      if (!movieSwipes[swipe.movieId]) {
        movieSwipes[swipe.movieId] = []
      }
      movieSwipes[swipe.movieId].push(swipe.userId)
    }
  })
  
  // Find movies liked by all participants
  const allParticipantsIds = participants.map(p => p.id)
  const matches = []
  
  Object.keys(movieSwipes).forEach(movieId => {
    const likedBy = movieSwipes[movieId]
    const likedByAll = allParticipantsIds.every(id => likedBy.includes(id))
    const likedByCount = likedBy.length
    
    if (likedByAll) {
      matches.push({
        movieId,
        likedBy: likedByAll,
        likedByCount,
        matchPercentage: 100
      })
    } else if (likedByCount >= Math.ceil(allParticipantsIds.length / 2)) {
      // At least half liked it
      matches.push({
        movieId,
        likedBy: false,
        likedByCount,
        matchPercentage: Math.round((likedByCount / allParticipantsIds.length) * 100)
      })
    }
  })
  
  // Sort by match percentage (highest first)
  matches.sort((a, b) => b.matchPercentage - a.matchPercentage)
  
  return matches
}

// Simulate other users swiping
export function simulateOtherUserSwipe(movieId, participants, currentUserId) {
  const otherUsers = participants.filter(p => !p.isCurrentUser && p.id !== currentUserId)
  if (otherUsers.length === 0) return null
  
  const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)]
  const direction = Math.random() > 0.4 ? 'right' : 'left' // 60% chance of like
  
  return {
    userId: randomUser.id,
    userName: randomUser.name,
    movieId,
    direction,
    timestamp: Date.now()
  }
}

