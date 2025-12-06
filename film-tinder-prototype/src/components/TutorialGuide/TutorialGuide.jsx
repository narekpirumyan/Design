import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi'

export function TutorialGuide({ 
  steps = [], 
  onComplete, 
  onSkip,
  sectionId,
  isActive = false
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState(null)
  const highlightRef = useRef(null)

  useEffect(() => {
    if (!isActive || steps.length === 0) return

    // Reset to first step when tutorial becomes active
    setCurrentStep(0)
    
    // Highlight the first element
    if (steps[0]?.targetSelector) {
      highlightElement(steps[0].targetSelector)
    }
  }, [isActive, steps])

  const highlightElement = (selector) => {
    if (!selector) {
      setHighlightedElement(null)
      return
    }

    // Try multiple selector strategies
    let element = document.querySelector(selector)
    
    // If not found, try querySelectorAll and get first
    if (!element) {
      const elements = document.querySelectorAll(selector)
      if (elements.length > 0) {
        element = elements[0]
      }
    }
    
    // If still not found, try by class name (remove . prefix)
    if (!element && selector.startsWith('.')) {
      const className = selector.substring(1)
      const elements = document.getElementsByClassName(className)
      if (elements.length > 0) {
        element = elements[0]
      }
    }
    
    // If still not found, try by data attribute
    if (!element && selector.includes('data-tutorial-target')) {
      const attrValue = selector.match(/\[data-tutorial-target="([^"]+)"\]/)?.[1]
      if (attrValue) {
        element = document.querySelector(`[data-tutorial-target="${attrValue}"]`)
      }
    }

    if (element) {
      setHighlightedElement(element)
      // Scroll element into view if needed
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } else {
      setHighlightedElement(null)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      if (steps[nextStep]?.targetSelector) {
        highlightElement(steps[nextStep].targetSelector)
      } else {
        setHighlightedElement(null)
      }
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      if (steps[prevStep]?.targetSelector) {
        highlightElement(steps[prevStep].targetSelector)
      } else {
        setHighlightedElement(null)
      }
    }
  }

  const handleComplete = () => {
    setHighlightedElement(null)
    onComplete?.(sectionId)
  }

  const handleSkip = () => {
    setHighlightedElement(null)
    onSkip?.(sectionId)
  }

  if (!isActive || steps.length === 0 || currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  // Get position for tooltip
  const getTooltipPosition = () => {
    if (!highlightedElement) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }

    const rect = highlightedElement.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // Determine best position
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    const spaceRight = viewportWidth - rect.right
    const spaceLeft = rect.left

    if (spaceBelow > 200) {
      // Show below
      return {
        top: `${rect.bottom + 20}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)'
      }
    } else if (spaceAbove > 200) {
      // Show above
      return {
        bottom: `${viewportHeight - rect.top + 20}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)'
      }
    } else if (spaceRight > 300) {
      // Show to the right
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + 20}px`,
        transform: 'translateY(-50%)'
      }
    } else {
      // Show to the left
      return {
        top: `${rect.top + rect.height / 2}px`,
        right: `${viewportWidth - rect.left + 20}px`,
        transform: 'translateY(-50%)'
      }
    }
  }

  const tooltipStyle = getTooltipPosition()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* Overlay with cutout for highlighted element */}
        <div className="absolute inset-0 bg-black/70">
          {highlightedElement && (
            <motion.div
              ref={highlightRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute border-4 border-white rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none"
              style={{
                top: highlightedElement.getBoundingClientRect().top - 8,
                left: highlightedElement.getBoundingClientRect().left - 8,
                width: highlightedElement.getBoundingClientRect().width + 16,
                height: highlightedElement.getBoundingClientRect().height + 16,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 255, 255, 0.5)'
              }}
            />
          )}
        </div>

        {/* Tooltip Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bg-white rounded-2xl shadow-2xl p-6 max-w-sm pointer-events-auto"
          style={tooltipStyle}
        >
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-pink-500 to-red-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Step Content */}
          <div className="mb-6">
            {step.icon && (
              <div className="text-4xl mb-3">{step.icon}</div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
            {step.action && (
              <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm text-pink-900 font-medium">
                  💡 {step.action}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={isFirst}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isFirst
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={isLast ? handleComplete : handleNext}
              className="flex items-center gap-2 px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90 transition-opacity shadow-lg"
            >
              {isLast ? (
                <>
                  Got it!
                  <FiCheck className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

