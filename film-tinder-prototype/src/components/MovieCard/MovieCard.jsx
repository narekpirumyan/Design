import { VibeTag } from '../VibeTag/VibeTag'

export function MovieCard({ movie, className = '' }) {
  return (
    <div className={`relative w-full h-full rounded-3xl overflow-hidden ${className}`}>
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {movie.title}
          <span className="text-lg text-text-secondary ml-2">({movie.year})</span>
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.vibeTags.slice(0, 3).map(tag => (
            <VibeTag key={tag} tag={tag} />
          ))}
        </div>
        <p className="text-sm text-text-secondary line-clamp-2">
          {movie.description}
        </p>
      </div>
    </div>
  )
}

