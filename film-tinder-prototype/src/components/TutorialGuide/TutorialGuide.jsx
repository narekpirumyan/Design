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
  const [highlightPosition, setHighlightPosition] = useState(null)
  const [guidePosition, setGuidePosition] = useState('bottom') // 'bottom' or 'top'
  const highlightRef = useRef(null)
  const tooltipRef = useRef(null)
  const updatePositionRef = useRef(null)

  // Update highlight position on scroll/resize
  const updateHighlightPosition = () => {
    if (!highlightedElement) return
    
    // Verify element is still in DOM
    if (!document.body.contains(highlightedElement)) {
      console.warn('Highlighted element no longer in DOM')
      setHighlightedElement(null)
      setHighlightPosition(null)
      return
    }
    
    const rect = highlightedElement.getBoundingClientRect()
    
    // Verify element has valid dimensions
    if (rect.width === 0 && rect.height === 0) {
      console.warn('Element has zero dimensions, retrying...')
      return
    }
    
    // Get the phone frame container to calculate relative position
    const phoneFrame = document.querySelector('[class*="relative"][class*="w-[375px]"]') || 
                       document.querySelector('.relative.w-\\[375px\\]') ||
                       highlightedElement.closest('[class*="h-full"]') ||
                       highlightedElement.closest('.phone-screen-content')
    
    if (phoneFrame) {
      const frameRect = phoneFrame.getBoundingClientRect()
      setHighlightPosition({
        top: rect.top - frameRect.top - 8,
        left: rect.left - frameRect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16
      })
    } else {
      // Fallback to viewport-relative positioning
      setHighlightPosition({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16
      })
    }
  }

  useEffect(() => {
    if (!isActive || steps.length === 0) {
      // Reset state when tutorial becomes inactive
      setCurrentStep(0)
      setHighlightedElement(null)
      setHighlightPosition(null)
      setGuidePosition('bottom')
      return
    }

    // Reset to first step when tutorial becomes active
    setCurrentStep(0)
    
    // Highlight the first element with a delay to ensure DOM is ready and animations complete
    setTimeout(() => {
      if (steps[0]?.targetSelector) {
        highlightElement(steps[0].targetSelector, 0)
      }
    }, 400) // Increased delay to ensure all animations have completed

    // Set up scroll/resize listeners
    updatePositionRef.current = () => updateHighlightPosition()
    const phoneFrame = document.querySelector('.phone-screen-content')
    if (phoneFrame) {
      phoneFrame.addEventListener('scroll', updatePositionRef.current, true)
    }
    window.addEventListener('resize', updatePositionRef.current)
    
    // Initial position update
    setTimeout(updateHighlightPosition, 100)

    return () => {
      if (updatePositionRef.current) {
        const phoneFrame = document.querySelector('.phone-screen-content')
        if (phoneFrame) {
          phoneFrame.removeEventListener('scroll', updatePositionRef.current, true)
        }
        window.removeEventListener('resize', updatePositionRef.current)
      }
    }
  }, [isActive, steps])

  const highlightElement = (selector, retryCount = 0) => {
    if (!selector) {
      setHighlightedElement(null)
      setHighlightPosition(null)
      return
    }

    // Try multiple selector strategies
    let element = null
    
    // First, try direct querySelector
    try {
      element = document.querySelector(selector)
    } catch (e) {
      console.warn('Selector error:', e)
    }
    
    // If not found, try querySelectorAll and get first
    if (!element) {
      try {
        const elements = document.querySelectorAll(selector)
        if (elements.length > 0) {
          element = elements[0]
        }
      } catch (e) {
        console.warn('SelectorAll error:', e)
      }
    }
    
    // If still not found, try by data attribute (extract value from selector)
    if (!element && selector.includes('data-tutorial-target')) {
      const attrValue = selector.match(/\[data-tutorial-target="([^"]+)"\]/)?.[1] || 
                       selector.match(/data-tutorial-target="([^"]+)"/)?.[1]
      if (attrValue) {
        element = document.querySelector(`[data-tutorial-target="${attrValue}"]`)
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

    // If element not found and we haven't exceeded retry limit, retry after a delay
    if (!element && retryCount < 10) {
      setTimeout(() => {
        highlightElement(selector, retryCount + 1)
      }, 100 * (retryCount + 1)) // Exponential backoff: 100ms, 200ms, 300ms, etc.
      return
    }

    if (element) {
      // Check if element is actually visible and has dimensions (not still animating)
      const rect = element.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(element)
      const isElementReady = rect.width > 0 && 
                            rect.height > 0 && 
                            element.offsetHeight > 0 && 
                            element.offsetWidth > 0 &&
                            computedStyle.opacity !== '0' &&
                            computedStyle.visibility !== 'hidden' &&
                            computedStyle.display !== 'none'
      
      // If element exists but isn't ready yet, retry
      if (!isElementReady && retryCount < 10) {
        setTimeout(() => {
          highlightElement(selector, retryCount + 1)
        }, 100 * (retryCount + 1))
        return
      }

      // Double-check element is still in DOM and valid
      if (!document.body.contains(element)) {
        if (retryCount < 10) {
          setTimeout(() => {
            highlightElement(selector, retryCount + 1)
          }, 100 * (retryCount + 1))
          return
        }
      }

      console.log('Setting highlighted element:', element, 'Selector:', selector)
      setHighlightedElement(element)
      
      // Immediately try to get position (don't wait for requestAnimationFrame)
      // This ensures position is set synchronously with element
      // Reuse the rect we already calculated above
      const phoneFrame = document.querySelector('.phone-screen-content') || 
                        element.closest('[class*="h-full"]') ||
                        document.querySelector('[class*="relative"][class*="w-[375px]"]')
      
      if (phoneFrame) {
        const frameRect = phoneFrame.getBoundingClientRect()
        const position = {
          top: rect.top - frameRect.top - 8,
          left: rect.left - frameRect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16
        }
        console.log('Setting highlight position:', position)
        setHighlightPosition(position)
      } else {
        // Fallback to viewport-relative positioning
        const position = {
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16
        }
        console.log('Setting highlight position (fallback):', position)
        setHighlightPosition(position)
      }
      
      // Use requestAnimationFrame for scroll handling only
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Verify element is still valid before scrolling
          if (!element || !document.body.contains(element)) {
            console.warn('Element no longer valid when checking scroll')
            return
          }
          
          // Only scroll within the phone frame container, not the entire page
          const phoneFrame = document.querySelector('.phone-screen-content') || 
                            element.closest('[class*="overflow"]')
          if (phoneFrame) {
            const elementRect = element.getBoundingClientRect()
            const containerRect = phoneFrame.getBoundingClientRect()
            
            // Check if element is visible within container
            const isVisible = (
              elementRect.top >= containerRect.top &&
              elementRect.bottom <= containerRect.bottom &&
              elementRect.left >= containerRect.left &&
              elementRect.right <= containerRect.right
            )
            
            // Only scroll if element is not fully visible
            if (!isVisible) {
              const scrollTop = phoneFrame.scrollTop
              const elementTop = element.offsetTop
              const elementHeight = element.offsetHeight
              const containerHeight = phoneFrame.clientHeight
              
              // Calculate scroll position to center element
              const targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2)
              
              phoneFrame.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
              })
              
              // Update position after scroll
              setTimeout(() => {
                if (element && document.body.contains(element)) {
                  updateHighlightPosition()
                }
              }, 350)
            }
          }
        })
      })
    } else {
      setHighlightedElement(null)
      setHighlightPosition(null)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      // Clear previous highlight first
      setHighlightedElement(null)
      setHighlightPosition(null)
      
      // Use requestAnimationFrame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Now update the step
          setCurrentStep(nextStep)
          
          // Wait for state update and DOM to be ready
          setTimeout(() => {
            if (steps[nextStep]?.targetSelector) {
              highlightElement(steps[nextStep].targetSelector, 0)
            } else {
              setHighlightedElement(null)
              setHighlightPosition(null)
            }
          }, 400) // Increased delay to allow state update and animations to complete
        })
      })
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      // Clear previous highlight first
      setHighlightedElement(null)
      setHighlightPosition(null)
      
      // Use requestAnimationFrame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Now update the step
          setCurrentStep(prevStep)
          
          // Wait for state update and DOM to be ready
          setTimeout(() => {
            if (steps[prevStep]?.targetSelector) {
              highlightElement(steps[prevStep].targetSelector, 0)
            } else {
              setHighlightedElement(null)
              setHighlightPosition(null)
            }
          }, 400) // Increased delay to allow state update and animations to complete
        })
      })
    }
  }

  const handleComplete = () => {
    setHighlightedElement(null)
    setHighlightPosition(null)
    setCurrentStep(0)
    onComplete?.(sectionId)
  }

  const handleSkip = () => {
    setHighlightedElement(null)
    setHighlightPosition(null)
    setCurrentStep(0)
    onSkip?.(sectionId)
  }

  // Return null if not active or no steps
  if (!isActive || steps.length === 0 || currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  // Update position when highlight changes and determine guide position
  useEffect(() => {
    if (!highlightedElement || !highlightPosition) return
    
    // Check if highlighted element is in the bottom area where guide would cover it
    const phoneFrame = document.querySelector('.phone-screen-content')
    if (phoneFrame) {
      const frameRect = phoneFrame.getBoundingClientRect()
      const frameHeight = frameRect.height || 812
      const guideHeight = frameHeight * 0.55 // 55% of screen height
      
      // If highlighted element is in bottom 60% of screen, move guide to top
      const elementBottom = highlightPosition.top + highlightPosition.height
      const threshold = frameHeight * 0.6
      
      if (elementBottom > threshold) {
        setGuidePosition('top')
      } else {
        setGuidePosition('bottom')
      }
    }
    // Note: We don't call updateHighlightPosition here to avoid infinite loop
    // Position updates are handled in highlightElement function
  }, [highlightedElement, highlightPosition, currentStep])

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay with cutout for highlighted element - inside phone frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              zIndex: 1000,
              pointerEvents: 'auto'
            }}
            onClick={(e) => {
              // Prevent clicks from going through to underlying content
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div 
              className="absolute inset-0 bg-black/70"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                // Block all clicks on the overlay
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              {highlightedElement && highlightPosition && (
                <motion.div
                  ref={highlightRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute border-4 border-white rounded-xl pointer-events-none"
                  style={{
                    top: `${highlightPosition.top}px`,
                    left: `${highlightPosition.left}px`,
                    width: `${highlightPosition.width}px`,
                    height: `${highlightPosition.height}px`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 255, 255, 0.5)'
                  }}
                />
              )}
            </div>
          </motion.div>

          {/* Tutorial Guide Bottom/Top Sheet - positioned absolutely within phone frame */}
          <motion.div
            initial={{ y: guidePosition === 'bottom' ? '100%' : '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: guidePosition === 'bottom' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`absolute left-0 right-0 bg-white z-[10001] overflow-hidden shadow-2xl pointer-events-auto ${
              guidePosition === 'bottom' ? 'bottom-0 rounded-t-3xl' : 'top-0 rounded-b-3xl'
            }`}
            style={{
              boxShadow: guidePosition === 'bottom' 
                ? '0 -10px 40px rgba(0, 0, 0, 0.3)' 
                : '0 10px 40px rgba(0, 0, 0, 0.3)',
              maxHeight: '55%'
            }}
          >
        {/* Drag Handle */}
        <div className={`flex justify-center ${guidePosition === 'bottom' ? 'pt-4 pb-2' : 'pb-4 pt-2'}`}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(55% - 60px)' }}>
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
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSkip()
              }}
              className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors pointer-events-auto z-10"
              type="button"
            >
              <FiX className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Step Content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-3">
              {step.description}
            </p>
            {step.action && (
              <div className="mt-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-xs text-pink-900 font-medium">
                  {step.action}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={isFirst}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90 transition-opacity shadow-lg"
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
        </div>
      </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

