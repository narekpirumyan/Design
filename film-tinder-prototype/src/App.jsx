import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CreateJoinRoomScreen } from './screens/CreateJoinRoom/CreateJoinRoomScreen'
import { GroupRoomScreen } from './screens/GroupRoom/GroupRoomScreen'
import { MatchResultScreen } from './screens/MatchResult/MatchResultScreen'
import { IndividualSwipeScreen } from './screens/IndividualSwipe/IndividualSwipeScreen'
import { WatchlistScreen } from './screens/Watchlist/WatchlistScreen'
import { ProfileScreen } from './screens/Profile/ProfileScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateJoinRoomScreen />} />
        <Route path="/room/:roomCode" element={<GroupRoomScreen />} />
        <Route path="/match/:roomCode" element={<MatchResultScreen />} />
        <Route path="/swipe" element={<IndividualSwipeScreen />} />
        <Route path="/watchlist" element={<WatchlistScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

