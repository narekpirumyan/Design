import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isFirstConnection, setIsFirstConnection] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completedTutorials, setCompletedTutorials] = useState({})

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    const storedFirstConnection = localStorage.getItem('isFirstConnection')
    const storedTutorials = localStorage.getItem('completedTutorials')
    
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsFirstConnection(storedFirstConnection === 'true')
      
      // Load completed tutorials
      if (storedTutorials) {
        setCompletedTutorials(JSON.parse(storedTutorials))
      } else if (userData.email) {
        // Check user-specific tutorial completion
        const userTutorials = localStorage.getItem(`user_${userData.email}_tutorials`)
        if (userTutorials) {
          setCompletedTutorials(JSON.parse(userTutorials))
        }
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, isGoogleSignIn = false) => {
    // Check if this is a first connection
    const firstConnection = !localStorage.getItem(`user_${userData.email}_preferences`)
    
    const user = {
      ...userData,
      id: userData.id || `user_${Date.now()}`,
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      avatar: userData.avatar || '👤',
      isGoogleSignIn
    }

    setUser(user)
    setIsFirstConnection(firstConnection)
    
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('isFirstConnection', firstConnection.toString())
    
    return { user, isFirstConnection: firstConnection }
  }

  const logout = () => {
    setUser(null)
    setIsFirstConnection(false)
    localStorage.removeItem('user')
    localStorage.removeItem('isFirstConnection')
  }

  const completePreferences = (preferences) => {
    // Save preferences
    localStorage.setItem(`user_${user.email}_preferences`, JSON.stringify(preferences))
    setIsFirstConnection(false)
    localStorage.setItem('isFirstConnection', 'false')
    
    // Update user with preferences
    const updatedUser = { ...user, preferences }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const updateInteractionModel = (model) => {
    if (!user) return
    
    const updatedPreferences = { ...user.preferences, interactionModel: model }
    const updatedUser = { ...user, preferences: updatedPreferences }
    
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    localStorage.setItem(`user_${user.email}_preferences`, JSON.stringify(updatedPreferences))
  }

  const completeTutorial = (sectionId) => {
    if (!user) return
    
    const updated = { ...completedTutorials, [sectionId]: true }
    setCompletedTutorials(updated)
    
    // Save to localStorage
    localStorage.setItem('completedTutorials', JSON.stringify(updated))
    if (user.email) {
      localStorage.setItem(`user_${user.email}_tutorials`, JSON.stringify(updated))
    }
  }

  const skipTutorial = (sectionId) => {
    if (!user) return
    
    const updated = { ...completedTutorials, [sectionId]: true }
    setCompletedTutorials(updated)
    
    // Save to localStorage
    localStorage.setItem('completedTutorials', JSON.stringify(updated))
    if (user.email) {
      localStorage.setItem(`user_${user.email}_tutorials`, JSON.stringify(updated))
    }
  }

  const hasCompletedTutorial = (sectionId) => {
    return completedTutorials[sectionId] === true
  }

  const value = {
    user,
    isFirstConnection,
    loading,
    login,
    logout,
    completePreferences,
    updateInteractionModel,
    completeTutorial,
    skipTutorial,
    hasCompletedTutorial,
    completedTutorials
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

