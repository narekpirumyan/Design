import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { motion } from 'framer-motion'

export function BackButton({ 
  onClick, 
  to = '/groups', 
  label = 'Back',
  className = '',
  variant = 'default' // 'default' or 'minimal'
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(to)
    }
  }

  const baseClasses = variant === 'minimal' 
    ? 'p-2 hover:bg-white/20 rounded-full transition-colors'
    : 'flex items-center gap-2 px-4 py-2 rounded-xl transition-colors'

  const textClasses = variant === 'minimal'
    ? 'text-white'
    : 'text-white hover:text-white/80'

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${textClasses} ${className}`}
    >
      <FiArrowLeft className="w-5 h-5" />
      {variant !== 'minimal' && <span>{label}</span>}
    </motion.button>
  )
}

