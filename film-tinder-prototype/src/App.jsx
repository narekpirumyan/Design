import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CreateJoinRoomScreen } from './screens/CreateJoinRoom/CreateJoinRoomScreen'
import { GroupRoomScreen } from './screens/GroupRoom/GroupRoomScreen'
import { MatchResultScreen } from './screens/MatchResult/MatchResultScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateJoinRoomScreen />} />
        <Route path="/room/:roomCode" element={<GroupRoomScreen />} />
        <Route path="/match/:roomCode" element={<MatchResultScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

