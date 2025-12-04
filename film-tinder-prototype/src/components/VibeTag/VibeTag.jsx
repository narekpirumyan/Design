export function VibeTag({ tag }) {
  const tagColors = {
    'mindblowing': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'intense': 'bg-red-500/20 text-red-300 border-red-500/30',
    'cozy': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'whimsical': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'stylish': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'chaotic': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'thought-provoking': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'emotional': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'romantic': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'adrenaline': 'bg-red-500/20 text-red-300 border-red-500/30',
    'social-commentary': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'magical': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'dark': 'bg-gray-700/20 text-gray-300 border-gray-600/30',
    'hopeful': 'bg-green-500/20 text-green-300 border-green-500/30',
    'epic': 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  }

  const colorClass = tagColors[tag] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      {tag}
    </span>
  )
}

