import { VibeTag } from '../VibeTag/VibeTag'

export function MovieCard({ movie, className = '', variant = 'default' }) {
  // For scroll mode, use a different layout
  const isScrollMode = variant === 'scroll'
  
  return (
    <div className={`relative w-full h-full rounded-3xl overflow-hidden ${className}`}>
      <img
        src={movie.poster}
        alt={movie.title}
        className={`w-full h-full ${isScrollMode ? 'object-cover' : 'object-contain'}`}
        style={{
          objectFit: isScrollMode ? 'cover' : 'contain',
          backgroundColor: '#1e293b'
        }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
        }}
      />
      <div className={`absolute inset-0 ${isScrollMode ? 'bg-gradient-to-t from-black via-black/60 to-transparent' : 'bg-gradient-to-t from-black/90 via-black/50 to-transparent'}`} />
      <div className={`absolute ${isScrollMode ? 'bottom-24' : 'bottom-0'} left-0 right-0 p-4 ${isScrollMode ? 'pb-4' : 'pb-6'}`}>
        <h2 className={`${isScrollMode ? 'text-xl' : 'text-2xl'} font-bold text-white mb-2`}>
          {movie.title}
          <span className={`${isScrollMode ? 'text-base' : 'text-lg'} text-text-secondary ml-2`}>({movie.year})</span>
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.vibeTags.slice(0, 3).map(tag => (
            <VibeTag key={tag} tag={tag} />
          ))}
        </div>
        <p className={`text-sm text-text-secondary ${isScrollMode ? 'line-clamp-2' : 'line-clamp-2'}`}>
          {movie.description}
        </p>
      </div>
    </div>
  )
}

