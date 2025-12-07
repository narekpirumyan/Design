import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwipeableCard } from '../../components/SwipeableCard/SwipeableCard'
import { ScrollableCardStack } from '../../components/ScrollableCardStack/ScrollableCardStack'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation'
import { FilmDetails } from '../../components/FilmDetails/FilmDetails'
import { FilmShorts } from '../../components/FilmShorts/FilmShorts'
import { TutorialGuide } from '../../components/TutorialGuide/TutorialGuide'
import { MoodSelectionModal } from '../../components/MoodSelectionModal/MoodSelectionModal'
import { CommentsModal } from '../../components/CommentsModal/CommentsModal'
import { mockMovies } from '../../data/mockMovies'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilm, FiInfo, FiVideo, FiSmile } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { getTutorialSteps } from '../../data/tutorialSteps'
import { GroupSelectionApproach1 } from './GroupSelectionApproach1'

export function IndividualSwipeScreen() {
  const navigate = useNavigate()
  const { user, hasCompletedTutorial, completeTutorial, skipTutorial } = useAuth()
  const [movies] = useState([...mockMovies].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showGroupSelection, setShowGroupSelection] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [mode, setMode] = useState('swipe') // 'swipe', 'details', 'shorts'
  const [showTutorial, setShowTutorial] = useState(false)
  const [showMoodSelection, setShowMoodSelection] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [selectedMovieForComments, setSelectedMovieForComments] = useState(null)
  const [isSaveAction, setIsSaveAction] = useState(false)
  
  // Get interaction model from user preferences (default to 'swipe')
  const interactionModel = user?.preferences?.interactionModel || 'swipe'

  // Show mood selection on entry (each time user enters this screen)
  useEffect(() => {
    // Load saved mood from sessionStorage first
    const savedMood = sessionStorage.getItem('currentMood')
    if (savedMood) {
      try {
        const parsedMood = JSON.parse(savedMood)
        setSelectedMood(parsedMood)
      } catch (e) {
        // If parsing fails, clear it
        sessionStorage.removeItem('currentMood')
      }
    }
    // Always show mood selection modal when entering this screen
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowMoodSelection(true)
    }, 300)
  }, [])

  // Reset mode to swipe on mount
  useEffect(() => {
    setMode('swipe')
  }, [])

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    sessionStorage.setItem('currentMood', JSON.stringify(mood))
    setShowMoodSelection(false)
  }

  const modes = ['swipe', 'details', 'shorts']
  const currentModeIndex = modes.indexOf(mode)
  const nextModeIndex = (currentModeIndex + 1) % modes.length
  const nextMode = modes[nextModeIndex]

  const modeIcons = {
    swipe: FiFilm,
    details: FiInfo,
    shorts: FiVideo
  }

  const handleModeToggle = () => {
    setMode(nextMode)
  }

  const handleSwipe = (direction, movieId) => {
    if (mode === 'swipe') {
      if (direction === 'right') {
        // Show group selection
        const movie = movies.find(m => m.id === movieId)
        setSelectedMovie(movie)
        setIsSaveAction(false) // This is a like action, should advance
        setShowGroupSelection(true)
      } else {
        // Just advance to next movie
        setCurrentIndex(prev => prev + 1)
      }
    } else {
      // In details/shorts mode, swiping goes back to swipe mode
      setMode('swipe')
    }
  }

  const handleScrollLike = (movieId) => {
    const movie = movies.find(m => m.id === movieId)
    setSelectedMovie(movie)
    setIsSaveAction(false) // This is a like action, should advance
    setShowGroupSelection(true)
  }

  const handleScrollPass = (movieId) => {
    // Just advance to next movie
    setCurrentIndex(prev => prev + 1)
  }

  const handleScrollInfo = (movieId) => {
    // Switch to details mode
    setMode('details')
  }

  const handleScrollComment = (movie) => {
    // Open comments modal
    setSelectedMovieForComments(movie)
    setShowComments(true)
  }

  const handleScrollSave = (movie) => {
    // Open group selection screen (same as swiping right, but without advancing)
    setSelectedMovie(movie)
    setIsSaveAction(true) // This is a save action, should NOT advance
    setShowGroupSelection(true)
  }

  const handleScrollIndexChange = (newIndex) => {
    setCurrentIndex(newIndex)
  }

  const handleAddToWatchlist = (movieId) => {
    const movie = movies.find(m => m.id === movieId)
    setSelectedMovie(movie)
    setShowGroupSelection(true)
  }


  const handleGroupSelected = (groupId) => {
    // Handle adding movie to group
    console.log(`Adding ${selectedMovie?.title} to group ${groupId}`)
    setShowGroupSelection(false)
    setSelectedMovie(null)
    // Only advance if it's not a save action
    if (!isSaveAction) {
      setCurrentIndex(prev => prev + 1)
    }
    setIsSaveAction(false) // Reset flag
  }

  const handleCloseGroupSelection = () => {
    setShowGroupSelection(false)
    setSelectedMovie(null)
    setIsSaveAction(false) // Reset flag
  }

  if (currentIndex >= movies.length) {
    return (
      <PhoneFrame>
        <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex items-center justify-center p-6 pb-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 max-w-md"
          >
            <h2 className="text-2xl font-bold text-white">All done!</h2>
            <p className="text-white/90">
              You've seen all the movies. Check your watchlists!
            </p>
            <button
              onClick={() => navigate('/groups')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Go Home
            </button>
          </motion.div>
          <BottomNavigation />
        </div>
      </PhoneFrame>
    )
  }

  const currentMovie = movies[currentIndex]
  const nextMovies = movies.slice(currentIndex, currentIndex + 3)

  // Don't show content if no mood is selected (first time)
  if (!selectedMood) {
    return (
      <PhoneFrame>
        <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col overflow-hidden relative">
          <MoodSelectionModal
            isOpen={showMoodSelection}
            onClose={() => {}} // Can't close without selecting on first time
            onSelectMood={handleMoodSelect}
            currentMood={null}
          />
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col overflow-hidden relative">
        {/* Mood Button - Top Right */}
        <div className="absolute top-4 right-4 z-30">
          <motion.button
            onClick={() => setShowMoodSelection(true)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border-2 border-white/30 flex items-center justify-center transition-all hover:bg-black/70 hover:border-white/50"
            title={`Current mood: ${selectedMood.name}`}
          >
            <span className="text-xl">{selectedMood.emoji}</span>
          </motion.button>
        </div>

        {/* Mode-based Content with Card Flip Animation */}
        <div className="absolute inset-0" style={{ perspective: '1200px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                duration: 0.6
              }}
              style={{
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%'
              }}
              className="relative"
            >
            {mode === 'swipe' && (
              <>
                {/* Swipe/Scroll Area */}
                <div className={`flex-1 relative w-full pb-20 h-full ${interactionModel === 'scroll' ? 'scroll-area' : 'swipe-area'}`}>
                  {interactionModel === 'scroll' ? (
                    <ScrollableCardStack
                      movies={movies}
                      currentIndex={currentIndex}
                      onLike={handleScrollLike}
                      onPass={handleScrollPass}
                      onInfo={handleScrollInfo}
                      onComment={handleScrollComment}
                      onSave={handleScrollSave}
                      onIndexChange={handleScrollIndexChange}
                    />
                  ) : (
                    <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                      {nextMovies.map((movie, idx) => (
                        <SwipeableCard
                          key={`${movie.id}-${currentIndex}`}
                          movie={movie}
                          index={idx}
                          isTop={idx === 0}
                          onSwipe={idx === 0 ? handleSwipe : undefined}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {mode === 'details' && (
              <div className="h-full">
                <FilmDetails
                  movie={currentMovie}
                  onBack={() => setMode('swipe')}
                  onSwipe={handleSwipe}
                  onAddToWatchlist={handleAddToWatchlist}
                />
              </div>
            )}

            {mode === 'shorts' && (
              <div className="h-full">
                <FilmShorts
                  movie={currentMovie}
                  onBack={() => setMode('swipe')}
                  onSwipe={handleSwipe}
                  onAddToWatchlist={handleAddToWatchlist}
                />
              </div>
            )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mode Switch Button - Camera Switch Style */}
        <div className="absolute top-4 left-4 z-30">
          <motion.button
            onClick={handleModeToggle}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border-2 border-white/30 flex items-center justify-center transition-all hover:bg-black/70 hover:border-white/50"
            aria-label={`Switch to ${nextMode} mode`}
            title={`Switch to ${nextMode.charAt(0).toUpperCase() + nextMode.slice(1)}`}
          >
            <motion.div
              key={nextMode}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const Icon = modeIcons[nextMode]
                return <Icon className="w-6 h-6 text-white" />
              })()}
            </motion.div>
          </motion.button>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Group Selection Overlay */}
        <AnimatePresence>
          {showGroupSelection && (
            <GroupSelectionApproach1 
              movie={selectedMovie} 
              onSelect={handleGroupSelected} 
              onClose={handleCloseGroupSelection} 
            />
          )}
        </AnimatePresence>

        {/* Mood Selection Modal */}
        <MoodSelectionModal
          isOpen={showMoodSelection}
          onClose={() => setShowMoodSelection(false)}
          onSelectMood={handleMoodSelect}
          currentMood={selectedMood}
        />

        {/* Comments Modal */}
        <CommentsModal
          isOpen={showComments}
          onClose={() => {
            setShowComments(false)
            setSelectedMovieForComments(null)
          }}
          movie={selectedMovieForComments}
        />

      </div>
    </PhoneFrame>
  )
}

