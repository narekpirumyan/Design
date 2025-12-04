# 📱 Film Tinder - Screen Breakdown & Navigation Map

## Navigation Structure

```
App Entry
├── Onboarding Flow (First Time Users)
│   ├── Welcome Screen
│   ├── Taste Profile Setup (Quick Questions)
│   └── Permissions (Optional)
│
├── Main App (Tab Navigation)
│   ├── Swipe Tab (Home)
│   │   ├── Swipe Screen (Main)
│   │   ├── Movie Detail Modal
│   │   └── Filter Panel
│   │
│   ├── Groups Tab
│   │   ├── Group List Screen
│   │   ├── Create/Join Room Screen
│   │   ├── Group Room Screen (Active)
│   │   └── Match Result Screen
│   │
│   ├── Profile Tab
│   │   ├── My Profile Screen
│   │   ├── Taste Profile View
│   │   ├── Watchlist Screen
│   │   └── Settings Screen
│   │
│   └── Friends Tab (Optional)
│       ├── Friends List
│       └── Friend Profile Screen
```

---

## Screen Inventory (Based on Feature Spec)

### 🔵 Core Screens (Build First)

#### 1. **Onboarding Flow**
**Features:** Smart Taste Profiles (#4)
- Quick questions (3-5 max)
- Genre preferences
- Mood selection
- Visual, engaging UI

**Components Needed:**
- Question card component
- Progress indicator
- Skip option

---

#### 2. **Swipe Screen** (Main Screen)
**Features:** 
- Swipe-based Movie Discovery (#1)
- Context-Based Filters (#6)
- TikTok-Style Trailer Cards (#10)
- Spoiler-Free Vibe Tags (#12)

**Layout:**
- Full-screen movie card stack
- Swipe gestures (left/right)
- Filter button (top right)
- Info button (bottom) - opens detail
- Trailer play button overlay

**Components:**
- `SwipeableCardStack`
- `MovieCard` (with poster, title, year, vibe tags)
- `FilterButton`
- `InfoButton`
- `TrailerOverlay` (vertical video player)

---

#### 3. **Movie Detail Screen/Modal**
**Features:**
- Rich Movie Info (#10, #11, #12)
- Streaming Availability Checker (#16)
- Meme Summary (#11)

**Layout:**
- Movie poster header
- Title, year, basic info
- Vibe tags row
- Meme summary section
- Streaming services list
- Trailer section
- Close/back button

**Components:**
- `MovieHeader`
- `VibeTags`
- `MemeSummary`
- `StreamingServices`
- `TrailerPlayer`

---

#### 4. **Group Room Screen**
**Features:**
- Group Rooms (#2)
- Real-time synchronization
- Reaction Emojis (#15)
- "I Don't Care" Button (#9)

**Layout:**
- Shared swipe area (same movie for all)
- Participant avatars (top)
- Real-time swipe indicators
- Reaction emoji picker
- "I Don't Care" toggle
- Room code display
- Leave room button

**Components:**
- `GroupRoomHeader` (participants)
- `SharedSwipeCard`
- `ReactionPicker`
- `RoomCodeDisplay`
- `FlexibilityToggle`

---

#### 5. **Match Result Screen**
**Features:**
- Match Result (#3)
- Shareable Match Posters (#20)
- Device Casting (#17)
- Watch Together Reminders (#18)

**Layout:**
- Celebratory header
- Match movie card (large)
- Match percentage/consensus
- "Why this match" explanation
- Action buttons:
  - View Details
  - Check Streaming
  - Cast to TV
  - Set Reminder
  - Share Poster
- Alternative matches (if any)

**Components:**
- `MatchCelebration`
- `MatchCard`
- `MatchExplanation`
- `ActionButtonGroup`
- `ShareablePoster`

---

#### 6. **Profile Screen**
**Features:**
- Smart Taste Profiles (#4)
- Watchlist Sharing (#14)
- Discovery Streaks (#21)
- Friend Profiles (#13)

**Layout:**
- Profile header (avatar, name, streak)
- Taste profile visualization
- Stats section
- Watchlist preview
- Settings link

**Components:**
- `ProfileHeader`
- `TasteProfileChart`
- `StatsCard`
- `WatchlistPreview`

---

### 🟢 Secondary Screens (Build Next)

#### 7. **Filter Screen**
**Features:** Context-Based Filters (#6)
- Modal or slide-up panel
- Filter categories:
  - Mood
  - Genre
  - Time available
  - Energy level
  - Vibe
- Apply/Clear buttons

---

#### 8. **Create/Join Room Screen**
**Features:** Group Rooms (#2)
- Create room button
- Join room input (code or link)
- Recent rooms list
- Share room code

---

#### 9. **Rapid Voting Screen** (Alternative to Swipe)
**Features:** Rapid Voting Mode (#7)
- Side-by-side movie comparison
- Large vote buttons
- Real-time vote count
- Quick transitions

---

#### 10. **Tie-Breaker Screen**
**Features:** Tie-Breaker Tool (#8)
- Shows when tie detected
- Explains tie-break logic
- Accept/Reject options
- Alternative methods

---

#### 11. **Watchlist Screen**
**Features:** Watchlist Sharing (#14)
- List of saved movies
- Share button
- Filter/sort options
- Remove items

---

#### 12. **Mood Playlists Screen**
**Features:** Mood-Based Playlists (#19)
- Grid of playlist cards
- Playlist detail view
- Create custom playlist

---

### 🟡 Optional/Advanced Screens

#### 13. **Settings Screen**
- Account settings
- Privacy controls
- Notification preferences
- App preferences

#### 14. **Friends Screen**
- Friends list
- Friend requests
- Search/add friends

#### 15. **Friend Profile Screen**
- Friend's taste profile
- Their watchlist
- Shared movies

---

## Component Library

### Core Components (Reusable)

1. **MovieCard**
   - Poster image
   - Title, year
   - Vibe tags
   - Swipeable wrapper

2. **SwipeableCard**
   - Gesture handling
   - Animation states
   - Swipe feedback

3. **VibeTag**
   - Colored chip
   - Icon + text
   - Multiple variants

4. **Button**
   - Primary, secondary variants
   - Loading states
   - Icon support

5. **FilterChip**
   - Selectable tag
   - Active/inactive states

6. **ParticipantAvatar**
   - User avatar
   - Online status
   - Activity indicator

7. **StreamingServiceBadge**
   - Service logo
   - Availability status
   - Price indicator

8. **ReactionEmoji**
   - Emoji display
   - Count badge
   - Animation

---

## User Flows

### Flow 1: Solo Movie Discovery
```
Onboarding → Swipe Screen → [Swipe movies] → Movie Detail (optional) → Continue Swiping
```

### Flow 2: Group Movie Selection
```
Groups Tab → Create/Join Room → Group Room Screen → [Group Swipes] → Match Result → Actions
```

### Flow 3: Quick Decision
```
Groups Tab → Rapid Voting → [Vote on pairs] → Match Result
```

### Flow 4: Profile Management
```
Profile Tab → View Taste Profile → Edit Profile → Save
```

---

## Data Models (Mock Data Structure)

```javascript
// Movie
{
  id: string,
  title: string,
  year: number,
  poster: string,
  genres: string[],
  vibeTags: string[],
  streamingServices: StreamingService[],
  trailer: string,
  memeSummary: MemeSummary,
  description: string
}

// User Profile
{
  id: string,
  name: string,
  avatar: string,
  tasteProfile: {
    genres: GenrePreference[],
    moods: MoodPreference[],
    energyLevel: string
  },
  watchlist: Movie[],
  streak: number
}

// Group Room
{
  id: string,
  code: string,
  participants: User[],
  currentMovie: Movie,
  swipes: Swipe[],
  matchResult: Movie | null,
  status: 'active' | 'matched' | 'ended'
}

// Swipe
{
  userId: string,
  movieId: string,
  direction: 'left' | 'right',
  timestamp: number
}
```

---

## Priority Build Order

### Week 1: Foundation
1. Project setup
2. Design system
3. Onboarding screen
4. Basic Swipe screen (no animations yet)

### Week 2: Core Features
5. Swipe animations
6. Movie detail modal
7. Group room screen (basic)
8. Match result screen

### Week 3: Polish & Secondary
9. Filter system
10. Profile screen
11. Watchlist
12. Animations and transitions

### Week 4: Advanced Features
13. Rapid voting
14. Tie-breaker
15. Social features
16. Final polish

---

## Technical Considerations

### Real-time Features (For Prototype)
- Use **mock real-time** (simulated delays)
- Or use **Firebase Realtime Database** (free tier)
- Or **Socket.io** for true real-time

### Movie Data
- **TMDB API** (free, no key needed for basic)
- Or mock data JSON files
- Include: posters, titles, years, genres

### Animations
- Swipe: Physics-based spring animations
- Card stack: Smooth transitions
- Loading: Skeleton screens
- Success: Celebration animations

### Performance
- Lazy load images
- Virtualize long lists
- Optimize animations (60fps target)
- Cache movie data

---

*Use this breakdown to plan your screen-by-screen development!*

