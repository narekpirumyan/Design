import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginScreen } from './screens/Login/LoginScreen'
import { PreferencesScreen } from './screens/Preferences/PreferencesScreen'
import { GroupsScreen } from './screens/Groups/GroupsScreen'
import { GroupDetailsScreen } from './screens/GroupDetails/GroupDetailsScreen'
import { GroupRoomScreen } from './screens/GroupRoom/GroupRoomScreen'
import { MatchResultScreen } from './screens/MatchResult/MatchResultScreen'
import { IndividualSwipeScreen } from './screens/IndividualSwipe/IndividualSwipeScreen'
import { SearchScreen } from './screens/Search/SearchScreen'
import { ProfileScreen } from './screens/Profile/ProfileScreen'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, isFirstConnection, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Only redirect to preferences if NOT already on preferences route
  if (isFirstConnection && location.pathname !== '/preferences') {
    return <Navigate to="/preferences" replace />
  }

  return children
}

// Preferences Route Component (allows access when isFirstConnection is true)
function PreferencesRoute({ children }) {
  const { user, isFirstConnection, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Allow access if first connection, otherwise redirect to groups
  if (!isFirstConnection) {
    return <Navigate to="/groups" replace />
  }

  return children
}

// Public Route Component (redirects to app if already logged in)
function PublicRoute({ children }) {
  const { user, isFirstConnection, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-red-600 via-pink-500 to-red-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (user && !isFirstConnection) {
    return <Navigate to="/groups" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginScreen />
          </PublicRoute>
        } 
      />
      
      {/* Preferences (only accessible if first connection) */}
      <Route 
        path="/preferences" 
        element={
          <PreferencesRoute>
            <PreferencesScreen />
          </PreferencesRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <GroupsScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/groups" 
        element={
          <ProtectedRoute>
            <GroupsScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/group/:groupId" 
        element={
          <ProtectedRoute>
            <GroupDetailsScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/room/:roomCode" 
        element={
          <ProtectedRoute>
            <GroupRoomScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/match/:roomCode" 
        element={
          <ProtectedRoute>
            <MatchResultScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/swipe" 
        element={
          <ProtectedRoute>
            <IndividualSwipeScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <SearchScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

