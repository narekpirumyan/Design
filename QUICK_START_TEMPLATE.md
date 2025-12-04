# 🚀 Quick Start Template - React Web Prototype

## Recommended Setup (Fastest Path)

### Step 1: Initialize Project

```bash
# Create React app with Vite (faster than CRA)
npm create vite@latest film-tinder-prototype -- --template react
cd film-tinder-prototype
npm install

# Install essential dependencies
npm install react-router-dom framer-motion react-icons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Project Structure

```
film-tinder-prototype/
├── public/
├── src/
│   ├── screens/
│   │   ├── Onboarding/
│   │   │   └── OnboardingScreen.jsx
│   │   ├── Swipe/
│   │   │   └── SwipeScreen.jsx
│   │   ├── GroupRoom/
│   │   │   └── GroupRoomScreen.jsx
│   │   ├── MatchResult/
│   │   │   └── MatchResultScreen.jsx
│   │   └── Profile/
│   │       └── ProfileScreen.jsx
│   │
│   ├── components/
│   │   ├── MovieCard/
│   │   │   ├── MovieCard.jsx
│   │   │   └── MovieCard.css
│   │   ├── SwipeableCard/
│   │   │   └── SwipeableCard.jsx
│   │   ├── VibeTag/
│   │   │   └── VibeTag.jsx
│   │   ├── Button/
│   │   │   └── Button.jsx
│   │   └── common/
│   │       ├── Header.jsx
│   │       └── TabBar.jsx
│   │
│   ├── theme/
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   │
│   ├── data/
│   │   └── mockMovies.js
│   │
│   ├── utils/
│   │   └── animations.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── package.json
```

### Step 3: Basic Files to Create

#### `src/theme/colors.js`
```javascript
export const colors = {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Purple
  accent: '#f59e0b',        // Amber
  background: '#0f172a',    // Dark slate
  surface: '#1e293b',       // Lighter slate
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    muted: '#94a3b8'
  },
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b'
}
```

#### `src/theme/spacing.js`
```javascript
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem'    // 64px
}
```

#### `src/data/mockMovies.js`
```javascript
export const mockMovies = [
  {
    id: '1',
    title: 'Inception',
    year: 2010,
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    vibeTags: ['mindblowing', 'intense', 'thought-provoking'],
    description: 'A mind-bending thriller about dreams within dreams.',
    streamingServices: [
      { name: 'Netflix', available: true, price: 'Included' },
      { name: 'HBO Max', available: true, price: 'Included' }
    ]
  },
  {
    id: '2',
    title: 'The Grand Budapest Hotel',
    year: 2014,
    poster: 'https://image.tmdb.org/t/p/w500/nX5XotM9yprCKarRH4fzOq1vm1q.jpg',
    genres: ['Comedy', 'Drama', 'Adventure'],
    vibeTags: ['whimsical', 'stylish', 'cozy'],
    description: 'A whimsical tale of a legendary concierge.',
    streamingServices: [
      { name: 'Disney+', available: true, price: 'Included' }
    ]
  },
  // Add more mock movies...
]
```

#### `src/components/MovieCard/MovieCard.jsx`
```javascript
import { motion } from 'framer-motion'
import { VibeTag } from '../VibeTag/VibeTag'
import './MovieCard.css'

export function MovieCard({ movie, onSwipe }) {
  return (
    <motion.div
      className="movie-card"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
          onSwipe('right')
        } else if (info.offset.x < -100) {
          onSwipe('left')
        }
      }}
    >
      <img src={movie.poster} alt={movie.title} />
      <div className="movie-info">
        <h2>{movie.title} ({movie.year})</h2>
        <div className="vibe-tags">
          {movie.vibeTags.map(tag => (
            <VibeTag key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
```

#### `src/screens/Swipe/SwipeScreen.jsx`
```javascript
import { useState } from 'react'
import { MovieCard } from '../../components/MovieCard/MovieCard'
import { mockMovies } from '../../data/mockMovies'

export function SwipeScreen() {
  const [movies, setMovies] = useState(mockMovies)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      console.log('Liked:', movies[currentIndex].title)
    } else {
      console.log('Skipped:', movies[currentIndex].title)
    }
    
    setCurrentIndex(prev => prev + 1)
  }

  if (currentIndex >= movies.length) {
    return <div>No more movies!</div>
  }

  return (
    <div className="swipe-screen">
      <MovieCard 
        movie={movies[currentIndex]} 
        onSwipe={handleSwipe}
      />
    </div>
  )
}
```

#### `src/App.jsx` (Basic Navigation)
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SwipeScreen } from './screens/Swipe/SwipeScreen'
import { GroupRoomScreen } from './screens/GroupRoom/GroupRoomScreen'
import { MatchResultScreen } from './screens/MatchResult/MatchResultScreen'
import { ProfileScreen } from './screens/Profile/ProfileScreen'
import { OnboardingScreen } from './screens/Onboarding/OnboardingScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingScreen />} />
        <Route path="/swipe" element={<SwipeScreen />} />
        <Route path="/group" element={<GroupRoomScreen />} />
        <Route path="/match" element={<MatchResultScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### Step 4: Tailwind Config

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#0f172a',
        surface: '#1e293b',
      },
    },
  },
  plugins: [],
}
```

### Step 5: Basic CSS

#### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #0f172a;
  color: #f1f5f9;
  overflow-x: hidden;
}

.movie-card {
  width: 100%;
  max-width: 400px;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  cursor: grab;
}

.movie-card:active {
  cursor: grabbing;
}

.movie-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 2rem;
}
```

---

## Development Workflow

### Daily Process:
1. **Morning:** Pick one screen/feature
2. **Build:** Create components and layout
3. **Test:** Check on mobile viewport (browser dev tools)
4. **Iterate:** Refine based on feel
5. **Commit:** Save progress

### Testing on Mobile:
- Use Chrome DevTools device emulation
- Or deploy to Vercel/Netlify and test on real device
- Or use `ngrok` to expose local server to phone

---

## Next Steps After Setup

1. ✅ Build Onboarding screen
2. ✅ Implement swipe gestures with animations
3. ✅ Create movie detail modal
4. ✅ Build group room interface
5. ✅ Design match result screen
6. ✅ Add navigation between screens
7. ✅ Polish animations and transitions

---

## Alternative: React Native Setup

If you want true native mobile:

```bash
# Install Expo CLI
npm install -g expo-cli

# Create new project
npx create-expo-app film-tinder-native

# Install dependencies
cd film-tinder-native
npx expo install react-native-gesture-handler react-native-reanimated
npm install react-navigation/native react-navigation/stack
```

Then follow similar structure but with React Native components.

---

*Start with the web version for speed, then consider native if needed!*

