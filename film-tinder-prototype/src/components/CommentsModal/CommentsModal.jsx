import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiLock, FiUnlock } from 'react-icons/fi'

// Mock comments data - mix of friends and others
const mockComments = [
  { id: 1, user: 'Sarah', text: 'This looks amazing! Can\'t wait to watch it! 🎬', time: '2h ago', isFriend: true, avatar: '👩' },
  { id: 2, user: 'Mike', text: 'One of my all-time favorites! The cinematography is stunning.', time: '5h ago', isFriend: true, avatar: '👨' },
  { id: 3, user: 'Alex', text: 'The ending still confuses me 😅', time: '1d ago', isFriend: false, avatar: '🧑' },
  { id: 4, user: 'Emma', text: 'Watched this 5 times and still finding new details!', time: '1d ago', isFriend: true, avatar: '👱‍♀️' },
  { id: 5, user: 'John', text: 'The score by Hans Zimmer is incredible', time: '2d ago', isFriend: false, avatar: '👤' },
  { id: 6, user: 'Lisa', text: 'Perfect for a movie night with friends!', time: '2d ago', isFriend: true, avatar: '👩‍🦰' },
  { id: 7, user: 'Tom', text: 'Not my cup of tea, but I can see why others like it.', time: '3d ago', isFriend: false, avatar: '👨‍🦱' },
  { id: 8, user: 'Anna', text: 'The plot twist got me! 🤯', time: '3d ago', isFriend: true, avatar: '👱' }
]

export function CommentsModal({ isOpen, onClose, movie }) {
  const [showFriendsOnly, setShowFriendsOnly] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [restrictToFriends, setRestrictToFriends] = useState(false)

  if (!isOpen) return null

  // Filter comments based on toggle
  const filteredComments = showFriendsOnly 
    ? mockComments.filter(c => c.isFriend)
    : mockComments

  // Sort: friends first, then others
  const sortedComments = [...filteredComments].sort((a, b) => {
    if (a.isFriend && !b.isFriend) return -1
    if (!a.isFriend && b.isFriend) return 1
    return 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      // Here you would add the comment to the backend
      console.log('Adding comment:', commentText, 'Restricted to friends:', restrictToFriends)
      setCommentText('')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/70 z-[100] flex items-end"
        style={{ position: 'absolute', zIndex: 100 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl w-full max-h-[80vh] flex flex-col"
          style={{
            maxHeight: '80vh'
          }}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">Comments</h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Friends Only Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFriendsOnly(!showFriendsOnly)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  showFriendsOnly
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showFriendsOnly ? 'Friends Only' : 'All Comments'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {sortedComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedComments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white text-lg">
                      {comment.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {comment.user}
                          {comment.isFriend && (
                            <span className="ml-1 text-xs text-pink-500">• Friend</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">{comment.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0 bg-white">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-2.5 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setRestrictToFriends(!restrictToFriends)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  title={restrictToFriends ? 'Visible to friends only' : 'Visible to everyone'}
                >
                  {restrictToFriends ? (
                    <FiLock className="w-4 h-4 text-pink-500" />
                  ) : (
                    <FiUnlock className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`px-4 py-2.5 rounded-full font-medium text-sm transition-colors ${
                  commentText.trim()
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

