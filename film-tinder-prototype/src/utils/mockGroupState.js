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


