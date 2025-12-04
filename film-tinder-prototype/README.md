# Film Tinder - UI/UX Prototype

A clean UI/UX prototype for Film Tinder's Group Movie Selection interface. This prototype focuses on visual design and user experience, demonstrating the interface within a phone frame.

## Features

- **Create/Join Room** - Start or join a group movie selection session
- **Group Swiping** - Swipe through movies with smooth animations
- **Match Results** - View matched movies with details
- **Phone Frame UI** - All screens displayed within a realistic phone frame

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
   - Use reaction emojis to express feelings
   - Each movie is shown once

3. **Match Result Screen**
   - View the matched movie with details
   - Check streaming options
   - Share the match
   - Create a new room to start over

## Project Structure

```
film-tinder-prototype/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button/
│   │   ├── MovieCard/
│   │   ├── ParticipantAvatar/
│   │   ├── PhoneFrame/
│   │   ├── RoomCodeDisplay/
│   │   ├── SwipeableCard/
│   │   └── VibeTag/
│   ├── screens/          # Main screen components
│   │   ├── CreateJoinRoom/
│   │   ├── GroupRoom/
│   │   └── MatchResult/
│   ├── data/            # Mock data (5 movies)
│   ├── utils/           # Helper functions
│   └── App.jsx          # Main app with routing
├── package.json
└── README.md
```

## Key Components

- **PhoneFrame** - Wraps all screens in a phone frame UI
- **SwipeableCard** - Draggable movie card with swipe gestures
- **MovieCard** - Movie poster and info display
- **VibeTag** - Colored tags for movie vibes
- **ParticipantAvatar** - User avatars with status
- **RoomCodeDisplay** - Room code with copy functionality

## Mock Data

The prototype uses mock data for:
- 5 popular movies with posters, descriptions, and vibe tags
- Mock group participants

## Notes

- This is a UI/UX-only prototype focused on visual design
- All screens are displayed within a phone frame
- Each movie is shown exactly once
- No backend or complex state management

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, etc.).
