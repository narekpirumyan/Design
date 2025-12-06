import { useState, useEffect } from 'react'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { TutorialGuide } from '../../components/TutorialGuide/TutorialGuide'
import { mockMovies } from '../../data/mockMovies'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { getTutorialSteps } from '../../data/tutorialSteps'
import { MovieCard } from '../../components/MovieCard/MovieCard'

export function SearchScreen() {
  const { user, hasCompletedTutorial, completeTutorial, skipTutorial } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Filter criteria
  const [filters, setFilters] = useState({
    genres: [],
    yearRange: { min: 1900, max: new Date().getFullYear() },
    rating: null,
    mood: null,
    streamingService: null
  })

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Fantasy', 'Documentary', 'Animation']
  const moods = ['Energetic', 'Relaxed', 'Thoughtful', 'Adventurous', 'Social']
  const streamingServices = ['Netflix', 'HBO Max', 'Disney+', 'Hulu', 'Amazon Prime']

  // Check if tutorial should be shown
  useEffect(() => {
    if (user && !hasCompletedTutorial('search')) {
      setTimeout(() => {
        setShowTutorial(true)
      }, 500)
    }
  }, [user, hasCompletedTutorial])

  // Perform search
  useEffect(() => {
    if (searchQuery.trim() || Object.keys(filters).some(key => {
      if (key === 'genres') return filters.genres.length > 0
      if (key === 'yearRange') return filters.yearRange.min !== 1900 || filters.yearRange.max !== new Date().getFullYear()
      return filters[key] !== null
    })) {
      setIsSearching(true)
      // Simulate search delay
      setTimeout(() => {
        let filtered = [...mockMovies]

        // Text search
        if (searchQuery.trim()) {
          filtered = filtered.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        }

        // Genre filter
        if (filters.genres.length > 0) {
          filtered = filtered.filter(movie =>
            filters.genres.some(genre => movie.genres.includes(genre))
          )
        }

        // Year filter
        filtered = filtered.filter(movie =>
          movie.year >= filters.yearRange.min && movie.year <= filters.yearRange.max
        )

        setResults(filtered)
        setIsSearching(false)
      }, 300)
    } else {
      setResults([])
    }
  }, [searchQuery, filters])

  const toggleGenre = (genre) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const clearFilters = () => {
    setFilters({
      genres: [],
      yearRange: { min: 1900, max: new Date().getFullYear() },
      rating: null,
      mood: null,
      streamingService: null
    })
    setSearchQuery('')
  }

  const hasActiveFilters = filters.genres.length > 0 ||
    filters.yearRange.min !== 1900 ||
    filters.yearRange.max !== new Date().getFullYear() ||
    filters.rating !== null ||
    filters.mood !== null ||
    filters.streamingService !== null

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 overflow-y-auto pb-20 relative">
        {/* Header */}
        <div className="px-6 pt-12 pb-4 sticky top-0 bg-gradient-to-br from-red-600 via-pink-500 to-red-700 z-10">
          <h1 className="text-3xl font-bold text-white mb-4">Search Movies</h1>
          
          {/* Search Bar */}
          <div className="relative mb-3">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, genre, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white/95 rounded-xl border-0 focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
              )}
              {showFilters ? (
                <FiChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <FiChevronDown className="w-4 h-4 ml-1" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-white/80 hover:text-white text-sm underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-4 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-4">
                {/* Genres */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filters.genres.includes(genre)
                            ? 'bg-white text-red-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Range */}
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    Year: {filters.yearRange.min} - {filters.yearRange.max}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/80 text-xs mb-1 block">Min Year</label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={filters.yearRange.min}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          yearRange: { ...prev.yearRange, min: parseInt(e.target.value) || 1900 }
                        }))}
                        className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 text-xs mb-1 block">Max Year</label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={filters.yearRange.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          yearRange: { ...prev.yearRange, max: parseInt(e.target.value) || new Date().getFullYear() }
                        }))}
                        className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Mood</h3>
                  <div className="flex flex-wrap gap-2">
                    {moods.map(mood => (
                      <button
                        key={mood}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          mood: prev.mood === mood ? null : mood
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filters.mood === mood
                            ? 'bg-white text-red-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Streaming Service */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Streaming Service</h3>
                  <div className="flex flex-wrap gap-2">
                    {streamingServices.map(service => (
                      <button
                        key={service}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          streamingService: prev.streamingService === service ? null : service
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filters.streamingService === service
                            ? 'bg-white text-red-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="px-6 pb-6">
          {isSearching ? (
            <div className="text-center py-12">
              <div className="text-white/80">Searching...</div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-white font-semibold">
                Found {results.length} {results.length === 1 ? 'movie' : 'movies'}
              </h2>
              {results.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="flex">
                    <div className="w-24 h-32 flex-shrink-0">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x600/1e293b/94a3b8?text=No+Poster'
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-gray-900 text-lg">{movie.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{movie.year}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genres.slice(0, 3).map(genre => (
                          <span key={genre} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{movie.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : searchQuery || hasActiveFilters ? (
            <div className="text-center py-12">
              <div className="text-white/80">No movies found. Try adjusting your search or filters.</div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-white/80">Start typing to search or use filters to find movies.</div>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation />

      {/* Tutorial Guide */}
      <TutorialGuide
        steps={getTutorialSteps('search', user)}
        sectionId="search"
        isActive={showTutorial}
        onComplete={(sectionId) => {
          completeTutorial(sectionId)
          setShowTutorial(false)
        }}
        onSkip={(sectionId) => {
          skipTutorial(sectionId)
          setShowTutorial(false)
        }}
      />
    </PhoneFrame>
  )
}

