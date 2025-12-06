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
  const highlightRef = useRef(null)
  const tooltipRef = useRef(null)
  const updatePositionRef = useRef(null)

  // Update highlight position on scroll/resize
  const updateHighlightPosition = () => {
    if (!highlightedElement) return
    
    const rect = highlightedElement.getBoundingClientRect()
    // Get the phone frame container to calculate relative position
    const phoneFrame = document.querySelector('[class*="relative"][class*="w-[375px]"]') || 
                       document.querySelector('.relative.w-\\[375px\\]') ||
                       highlightedElement.closest('[class*="h-full"]')
    
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
      // Restore body scroll when tutorial is inactive
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      return
    }

    // Prevent page-level scrolling when tutorial is active
    // This prevents the phone frame from scrolling out of view
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Reset to first step when tutorial becomes active
    setCurrentStep(0)
    
    // Highlight the first element
    if (steps[0]?.targetSelector) {
      highlightElement(steps[0].targetSelector)
    }

    // Set up scroll/resize listeners
    updatePositionRef.current = () => updateHighlightPosition()
    window.addEventListener('scroll', updatePositionRef.current, true)
    window.addEventListener('resize', updatePositionRef.current)
    
    // Initial position update
    setTimeout(updateHighlightPosition, 100)

    return () => {
      // Restore original overflow styles
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      if (updatePositionRef.current) {
        window.removeEventListener('scroll', updatePositionRef.current, true)
        window.removeEventListener('resize', updatePositionRef.current)
      }
    }
  }, [isActive, steps])

  const highlightElement = (selector) => {
    if (!selector) {
      setHighlightedElement(null)
      setHighlightPosition(null)
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
      // Update position immediately without scrolling the page
      setTimeout(() => {
        updateHighlightPosition()
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
            setTimeout(updateHighlightPosition, 300)
          } else {
            updateHighlightPosition()
          }
        } else {
          updateHighlightPosition()
        }
      }, 100)
    } else {
      setHighlightedElement(null)
      setHighlightPosition(null)
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
        setHighlightPosition(null)
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
        setHighlightPosition(null)
      }
    }
  }

  const handleComplete = () => {
    setHighlightedElement(null)
    setHighlightPosition(null)
    onComplete?.(sectionId)
  }

  const handleSkip = () => {
    setHighlightedElement(null)
    setHighlightPosition(null)
    onSkip?.(sectionId)
  }

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  // Get position for tooltip relative to phone frame
  const getTooltipPosition = () => {
    if (!highlightedElement || !highlightPosition) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '90%', maxHeight: '80%' }
    }

    // Get phone frame for relative positioning
    const phoneFrame = document.querySelector('[class*="relative"][class*="w-[375px]"]') || 
                       document.querySelector('.relative.w-\\[375px\\]') ||
                       highlightedElement.closest('[class*="h-full"]')
    
    const frameRect = phoneFrame?.getBoundingClientRect() || { top: 0, left: 0, width: 375, height: 812 }
    const frameHeight = frameRect.height || 812
    const frameWidth = frameRect.width || 375

    // Get actual tooltip dimensions if available, otherwise use estimates
    let tooltipWidth = 320
    let tooltipHeight = 250
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      tooltipWidth = tooltipRect.width || 320
      tooltipHeight = tooltipRect.height || 250
    }

    // Calculate relative positions
    const relativeTop = highlightPosition.top + 8
    const relativeLeft = highlightPosition.left + 8
    const elementHeight = highlightPosition.height - 16
    const elementWidth = highlightPosition.width - 16

    // Determine available space
    const spaceBelow = frameHeight - (relativeTop + elementHeight)
    const spaceAbove = relativeTop
    const spaceRight = frameWidth - (relativeLeft + elementWidth)
    const spaceLeft = relativeLeft

    // Calculate positions with padding to ensure tooltip stays within bounds
    const padding = 20

    // Try to position tooltip below first (most common case)
    if (spaceBelow >= 150) {
      const top = relativeTop + elementHeight + 20
      let left = relativeLeft + elementWidth / 2 - tooltipWidth / 2
      // Ensure tooltip doesn't go outside bounds
      left = Math.max(padding, Math.min(left, frameWidth - tooltipWidth - padding))
      // Calculate available height, ensuring tooltip fits
      const availableHeight = Math.max(200, spaceBelow - 40)
      return {
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${Math.min(340, frameWidth - padding * 2)}px`,
        maxHeight: `${availableHeight}px`,
        overflowY: availableHeight < 300 ? 'auto' : 'visible'
      }
    }
    // Try above
    else if (spaceAbove >= 150) {
      const bottom = frameHeight - relativeTop + 20
      let left = relativeLeft + elementWidth / 2 - tooltipWidth / 2
      left = Math.max(padding, Math.min(left, frameWidth - tooltipWidth - padding))
      const availableHeight = Math.max(200, spaceAbove - 40)
      return {
        bottom: `${bottom}px`,
        left: `${left}px`,
        maxWidth: `${Math.min(340, frameWidth - padding * 2)}px`,
        maxHeight: `${availableHeight}px`,
        overflowY: availableHeight < 300 ? 'auto' : 'visible'
      }
    }
    // Try to the right
    else if (spaceRight >= 340) {
      let top = relativeTop + elementHeight / 2 - tooltipHeight / 2
      top = Math.max(padding, Math.min(top, frameHeight - tooltipHeight - padding))
      const left = relativeLeft + elementWidth + 20
      return {
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${Math.min(340, spaceRight - 40)}px`,
        maxHeight: `${Math.min(400, frameHeight - padding * 2)}px`,
        overflowY: 'auto'
      }
    }
    // Try to the left
    else if (spaceLeft >= 340) {
      let top = relativeTop + elementHeight / 2 - tooltipHeight / 2
      top = Math.max(padding, Math.min(top, frameHeight - tooltipHeight - padding))
      const right = frameWidth - relativeLeft + 20
      return {
        top: `${top}px`,
        right: `${right}px`,
        maxWidth: `${Math.min(340, spaceLeft - 40)}px`,
        maxHeight: `${Math.min(400, frameHeight - padding * 2)}px`,
        overflowY: 'auto'
      }
    }
    // Fallback: center with constraints - always visible
    else {
      const centerMaxHeight = frameHeight - padding * 2
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: `${frameWidth - padding * 2}px`,
        maxHeight: `${centerMaxHeight}px`,
        overflowY: centerMaxHeight < 400 ? 'auto' : 'visible'
      }
    }
  }

  const tooltipStyle = getTooltipPosition()

  // Update position when highlight changes
  useEffect(() => {
    if (highlightedElement) {
      updateHighlightPosition()
    }
  }, [highlightedElement, currentStep])

  // Recalculate tooltip position after it renders to ensure it's fully visible
  useEffect(() => {
    if (tooltipRef.current && highlightedElement) {
      const tooltip = tooltipRef.current
      const phoneFrame = document.querySelector('.phone-screen-content')
      
      if (phoneFrame) {
        const tooltipRect = tooltip.getBoundingClientRect()
        const frameRect = phoneFrame.getBoundingClientRect()
        
        // Check if tooltip is outside bounds and adjust
        const tooltipStyle = window.getComputedStyle(tooltip)
        const currentTop = parseFloat(tooltipStyle.top) || 0
        const currentLeft = parseFloat(tooltipStyle.left) || 0
        
        let newTop = currentTop
        let newLeft = currentLeft
        
        // Adjust if tooltip goes outside right edge
        if (tooltipRect.right > frameRect.right - 20) {
          newLeft = frameRect.width - tooltipRect.width - 20
        }
        // Adjust if tooltip goes outside left edge
        if (tooltipRect.left < frameRect.left + 20) {
          newLeft = 20
        }
        // Adjust if tooltip goes outside bottom edge
        if (tooltipRect.bottom > frameRect.bottom - 20) {
          newTop = frameRect.height - tooltipRect.height - 20
        }
        // Adjust if tooltip goes outside top edge
        if (tooltipRect.top < frameRect.top + 20) {
          newTop = 20
        }
        
        // Only update if position needs adjustment
        if (newTop !== currentTop || newLeft !== currentLeft) {
          tooltip.style.top = `${newTop}px`
          tooltip.style.left = `${newLeft}px`
          tooltip.style.right = 'auto'
          tooltip.style.bottom = 'auto'
          tooltip.style.transform = 'none'
        }
      }
    }
  }, [tooltipStyle, highlightedElement, currentStep])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        overflow: 'visible',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        clipPath: 'none'
      }}
    >
        {/* Overlay with cutout for highlighted element */}
        <div className="absolute inset-0 bg-black/70">
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

        {/* Tooltip Card */}
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto"
          style={{
            ...tooltipStyle,
            width: tooltipStyle.maxWidth || '320px',
            maxWidth: tooltipStyle.maxWidth || '320px',
            maxHeight: tooltipStyle.maxHeight || '400px',
            overflowY: tooltipStyle.overflowY || 'auto',
            overflowX: 'hidden',
            zIndex: 10001,
            boxSizing: 'border-box',
            // Ensure tooltip is never clipped
            willChange: 'transform',
            contain: 'none'
          }}
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
  )
}

