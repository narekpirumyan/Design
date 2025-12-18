import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiFilm } from 'react-icons/fi'
import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const result = login({
        email,
        name: email.split('@')[0],
        avatar: '👤'
      }, false)
      
      setLoading(false)
      
      // Navigate to preferences if first connection, otherwise to main app
      if (result.isFirstConnection) {
        navigate('/preferences')
      } else {
        navigate('/groups')
      }
    }, 800)
  }

  const handleGoogleSignIn = () => {
    setLoading(true)
    setError('')
    
    // Simulate Google sign-in
    setTimeout(() => {
      const mockGoogleUser = {
        email: 'user@gmail.com',
        name: 'John Doe',
        avatar: '👨',
        id: 'google_user_123'
      }
      
      const result = login(mockGoogleUser, true)
      setLoading(false)
      
      // Navigate to preferences if first connection, otherwise to main app
      if (result.isFirstConnection) {
        navigate('/preferences')
      } else {
        navigate('/groups')
      }
    }, 800)
  }

  return (
    <PhoneFrame>
      <div className="h-full bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl"
            >
              <FiFilm className="w-10 h-10 text-red-600" />
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Welcome to CinéA
          </h1>
          <p className="text-white/80 text-center mb-8">
            Discover your next favorite movie
          </p>

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/95 rounded-xl border-0 focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/95 rounded-xl border-0 focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-200 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-red-600 font-semibold py-3 rounded-xl shadow-lg hover:bg-white/95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-4 text-white/70 text-sm">or</span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-gray-700 font-semibold py-3 rounded-xl shadow-lg hover:bg-white/95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </motion.button>

          {/* Footer */}
          <p className="text-white/60 text-xs text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </PhoneFrame>
  )
}

