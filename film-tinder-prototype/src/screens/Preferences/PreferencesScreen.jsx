import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiArrowLeft, FiCheck, FiLogOut } from 'react-icons/fi'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const questions = [
  {
    id: 'welcome',
    type: 'welcome',
    title: "Let's personalize your experience!",
    description: "We'll ask you a few quick questions to understand your movie preferences and recommend films you'll love.",
    icon: '🎬'
  },
  {
    id: 'genres',
    type: 'multi-select',
    title: 'What genres do you enjoy?',
    description: 'Select all that apply',
    options: [
      { id: 'action', label: 'Action', emoji: '💥' },
      { id: 'comedy', label: 'Comedy', emoji: '😂' },
      { id: 'drama', label: 'Drama', emoji: '🎭' },
      { id: 'horror', label: 'Horror', emoji: '👻' },
      { id: 'sci-fi', label: 'Sci-Fi', emoji: '🚀' },
      { id: 'romance', label: 'Romance', emoji: '💕' },
      { id: 'thriller', label: 'Thriller', emoji: '🔪' },
      { id: 'fantasy', label: 'Fantasy', emoji: '✨' },
      { id: 'documentary', label: 'Documentary', emoji: '📚' },
      { id: 'animation', label: 'Animation', emoji: '🎨' }
    ],
    minSelections: 1
  },
  {
    id: 'mood',
    type: 'single-select',
    title: 'What mood are you usually in when watching movies?',
    description: 'Choose the one that best describes you',
    options: [
      { id: 'energetic', label: 'Energetic & Excited', emoji: '⚡', description: 'I want something thrilling and fast-paced' },
      { id: 'relaxed', label: 'Relaxed & Chill', emoji: '😌', description: 'I prefer calm and easy-going films' },
      { id: 'thoughtful', label: 'Thoughtful & Reflective', emoji: '🤔', description: 'I enjoy deep, meaningful stories' },
      { id: 'adventurous', label: 'Adventurous & Curious', emoji: '🗺️', description: 'I like exploring new worlds and ideas' },
      { id: 'social', label: 'Social & Fun', emoji: '🎉', description: 'I watch movies to have a good time with others' }
    ]
  },
  {
    id: 'watchtime',
    type: 'single-select',
    title: 'When do you usually watch movies?',
    description: 'This helps us suggest the right length and intensity',
    options: [
      { id: 'evening', label: 'Evening', emoji: '🌙', description: 'After work, looking to unwind' },
      { id: 'weekend', label: 'Weekend', emoji: '🎬', description: 'I have more time to dive deep' },
      { id: 'anytime', label: 'Anytime', emoji: '⏰', description: 'I watch whenever I have a moment' },
      { id: 'night', label: 'Late Night', emoji: '🌃', description: 'I prefer watching late at night' }
    ]
  },
  {
    id: 'interactionModel',
    type: 'single-select',
    title: 'How would you like to browse movies?',
    description: 'Choose your preferred interaction style',
    options: [
      { id: 'swipe', label: 'Tinder-like Swipe', emoji: '👆', description: 'Swipe left to pass, right to like' },
      { id: 'scroll', label: 'Instagram-like Scroll', emoji: '📱', description: 'Scroll vertically through movies like reels' }
    ]
  },
  {
    id: 'completion',
    type: 'completion',
    title: "You're all set!",
    description: "We've saved your preferences. Let's start discovering amazing movies!",
    icon: '🎉'
  }
]

export function PreferencesScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const { completePreferences, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isWelcomeScreen = currentQuestion.type === 'welcome'
  const isCompletionScreen = currentQuestion.type === 'completion'

  const handleMultiSelect = (optionId) => {
    const currentSelections = answers[currentQuestion.id] || []
    const newSelections = currentSelections.includes(optionId)
      ? currentSelections.filter(id => id !== optionId)
      : [...currentSelections, optionId]
    
    setAnswers({ ...answers, [currentQuestion.id]: newSelections })
  }

  const handleSingleSelect = (optionId) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId })
  }

  const canProceed = () => {
    if (isWelcomeScreen || isCompletionScreen) return true
    
    const answer = answers[currentQuestion.id]
    if (!answer) return false
    
    if (currentQuestion.type === 'multi-select') {
      return answer.length >= (currentQuestion.minSelections || 1)
    }
    
    return true
  }

  const handleNext = () => {
    if (isCompletionScreen) {
      // Save preferences and navigate to main app
      setLoading(true)
      setTimeout(() => {
        completePreferences(answers)
        navigate('/groups')
      }, 500)
      return
    }

    if (canProceed()) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const getProgress = () => {
    // Exclude welcome and completion screens from progress
    const totalQuestions = questions.length - 2
    const answeredQuestions = Object.keys(answers).length
    return Math.min((answeredQuestions / totalQuestions) * 100, 100)
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col relative">
        {/* Logout Button (for demo purposes) */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
          title="Logout (for demo)"
        >
          <FiLogOut className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        {!isWelcomeScreen && !isCompletionScreen && (
          <div className="px-6 pt-12 pb-4">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-white/70 text-xs mt-2 text-center">
              {currentQuestionIndex - 1} of {questions.length - 2} questions
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center justify-center min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm py-4"
              >
                {/* Welcome/Completion Screen */}
                {(isWelcomeScreen || isCompletionScreen) && (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="text-6xl mb-6"
                    >
                      {currentQuestion.icon}
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {currentQuestion.title}
                    </h2>
                    <p className="text-white/80 text-lg">
                      {currentQuestion.description}
                    </p>
                  </div>
                )}

                {/* Question Screen */}
                {!isWelcomeScreen && !isCompletionScreen && (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {currentQuestion.title}
                      </h2>
                      <p className="text-white/70 text-sm">
                        {currentQuestion.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => {
                        const isSelected = currentQuestion.type === 'multi-select'
                          ? (answers[currentQuestion.id] || []).includes(option.id)
                          : answers[currentQuestion.id] === option.id

                        return (
                          <motion.button
                            key={option.id}
                            onClick={() => {
                              if (currentQuestion.type === 'multi-select') {
                                handleMultiSelect(option.id)
                              } else {
                                handleSingleSelect(option.id)
                              }
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-4 rounded-xl text-left transition-all ${
                              isSelected
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{option.emoji}</span>
                              <div className="flex-1">
                                <div className="font-semibold">{option.label}</div>
                                {option.description && (
                                  <div className={`text-xs mt-1 ${
                                    isSelected ? 'text-gray-600' : 'text-white/70'
                                  }`}>
                                    {option.description}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"
                                >
                                  <FiCheck className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 pb-8 pt-4">
          <div className="flex items-center justify-between gap-4">
            <motion.button
              onClick={handleBack}
              disabled={isFirstQuestion || loading}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isFirstQuestion || loading
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FiArrowLeft className="w-5 h-5" />
              Back
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                !canProceed() || loading
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white text-red-600 hover:bg-white/95'
              }`}
            >
              {loading ? 'Loading...' : isCompletionScreen ? 'Get Started' : 'Next'}
              {!loading && !isCompletionScreen && <FiArrowRight className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

