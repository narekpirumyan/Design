# Film Tinder - Group Movie Selection Prototype

An interactive UI/UX prototype for Film Tinder's Group Movie Selection flow. This prototype demonstrates how friends can collaboratively discover movies they'll all enjoy together.

## Features

- **Create/Join Room** - Start or join a group movie selection session
- **Group Swiping** - Real-time collaborative movie discovery with swipe gestures
- **Match Detection** - Automatically finds movies liked by all group members
- **Match Results** - Celebratory screen showing the matched movie with actions

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd film-tinder-prototype
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Demo Flow

1. **Create/Join Room Screen**
   - Click "Create New Room" to start a session
   - Or enter a 6-digit room code to join an existing room

2. **Group Room Screen**
   - Swipe right (or click heart) to like a movie
   - Swipe left (or click X) to pass on a movie
   - Watch as other participants (simulated) also swipe
   - Use reaction emojis to express feelings
   - Toggle "I Don't Care" if you're flexible

3. **Match Result Screen**
   - See the matched movie when everyone likes the same film
   - View streaming options
   - Share the match
   - Create a new room to start over

### Mobile Testing

The prototype is optimized for mobile viewports (375px - 414px). To test on PC:

1. Open browser DevTools (F12)
2. Enable device emulation
3. Select a mobile device (iPhone 12, Pixel 5, etc.)
4. Refresh the page

## Project Structure

```
film-tinder-prototype/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Main screen components
│   ├── data/            # Mock data
│   ├── utils/           # Helper functions
│   ├── theme/           # Design system
│   └── App.jsx          # Main app with routing
├── public/
└── package.json
```

## Key Components

- **SwipeableCard** - Draggable movie card with swipe gestures
- **MovieCard** - Movie poster and info display
- **VibeTag** - Colored tags for movie vibes
- **ParticipantAvatar** - User avatars with status
- **RoomCodeDisplay** - Room code with copy functionality

## Mock Data

The prototype uses mock data for:
- 20 popular movies with posters, descriptions, and vibe tags
- Simulated group participants
- Real-time swipe simulation

## Notes

- All state is managed locally (no backend)
- Real-time behavior is simulated with delays
- Match detection finds movies liked by all participants
- Optimized for mobile-first responsive design

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, etc.).

## License

This is a prototype/demo project.

