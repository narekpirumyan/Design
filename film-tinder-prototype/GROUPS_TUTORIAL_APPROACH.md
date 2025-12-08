# First-Time User Guide Approach for Groups Screen

## Overview
This document outlines the approach for implementing a first-time user guide for the Groups screen. The guide will help new users understand the Groups section and its key features.

## Design Principles

1. **Mobile-First**: All hints and guides must fit comfortably on a phone screen (375px width)
2. **Non-Intrusive**: Small, compact messages that don't overwhelm the user
3. **Progressive**: Multi-step guide that highlights one feature at a time
4. **Dismissible**: Users can skip or cancel at any time
5. **One-Time Only**: Guide shows only on first visit, tracked via localStorage

## Implementation Approach

### 1. Tutorial State Management

**Location**: `GroupsScreen.jsx`

**State Variables**:
- `showTutorial`: Boolean state to control tutorial visibility
- Managed via `useState` and `useEffect`

**Logic**:
```javascript
const [showTutorial, setShowTutorial] = useState(false)

useEffect(() => {
  // Check if user has completed this tutorial
  if (user && !hasCompletedTutorial('groups')) {
    // Small delay to ensure smooth screen transition
    setTimeout(() => {
      setShowTutorial(true)
    }, 500)
  }
}, [user, hasCompletedTutorial])
```

### 2. Tutorial Steps Configuration

**Current Steps** (from `tutorialSteps.js`):
1. **Welcome Step** - Overview of Groups & Watchlist section (no highlight)
2. **Personal Watchlist** - Highlights the personal watchlist card
3. **Your Groups** - Highlights a group card
4. **Create New Group** - Highlights the create button
5. **Friends Tab** - Highlights the Friends tab

**Optimizations Needed**:
- ✅ Steps are already concise (good for mobile)
- ✅ Text is short and actionable
- ✅ Selectors are already defined
- ⚠️ Need to verify selectors match actual DOM elements

### 3. Component Integration

**Existing Components**:
- `TutorialGuide` component is already imported
- `getTutorialSteps` function is already imported
- `data-tutorial-target` attributes are already in place

**Integration Pattern**:
```jsx
<TutorialGuide
  steps={getTutorialSteps('groups', user)}
  sectionId="groups"
  isActive={showTutorial}
  onComplete={(sectionId) => {
    completeTutorial(sectionId)
    setShowTutorial(false)
  }}
  onSkip={(sectionId) => {
    skipTutorial(sectionId)
    setShowTutorial(false)
  }}
/>
```

### 4. Tutorial Guide Features

**Existing TutorialGuide Component Provides**:
- ✅ Dark overlay with highlighted element cutout
- ✅ Bottom/top sheet with compact content (max 55% height)
- ✅ Progress indicator (step X of Y)
- ✅ Previous/Next navigation buttons
- ✅ Skip (X) button in header
- ✅ Auto-positioning (top/bottom based on element location)
- ✅ Smooth animations
- ✅ Mobile-optimized sizing

**Content Structure**:
- Title (concise, 1 line)
- Description (2-3 lines max)
- Optional action hint (in pink box)
- Navigation buttons

### 5. Selector Verification

**Current Selectors** (need verification):
1. `[class*="from-pink-500 to-red-500"]` - Personal watchlist card
2. `.group-card` - Group cards
3. `[data-tutorial-target="create-group"]` - Create button ✅
4. `[data-tutorial-target="friends-tab"]` - Friends tab ✅

**Recommendation**: Update selectors to use `data-tutorial-target` attributes for better reliability:
- Add `data-tutorial-target="personal-watchlist"` to personal watchlist card
- Add `data-tutorial-target="group-card"` to first group card (or use class selector if all groups should be highlighted)

### 6. User Experience Flow

1. **First Visit**:
   - User navigates to Groups screen
   - After 500ms delay, tutorial overlay appears
   - First step shows welcome message (no highlight)
   - User clicks "Next"

2. **Progressive Discovery**:
   - Each step highlights a specific element
   - Guide sheet positions itself (top/bottom) to avoid covering highlighted element
   - User can navigate forward/backward
   - User can skip at any time

3. **Completion**:
   - On "Got it!" (last step) or "Skip", tutorial is marked complete
   - State saved to localStorage
   - Tutorial won't show again for this user

### 7. Mobile Optimization Checklist

- ✅ Guide sheet max height: 55% of screen
- ✅ Text is concise (titles < 30 chars, descriptions < 150 chars)
- ✅ Buttons are touch-friendly (min 44px height)
- ✅ Progress indicator shows current step
- ✅ Auto-scrolls to highlighted elements
- ✅ Works in portrait orientation
- ✅ No horizontal scrolling required

## Implementation Steps

1. **Add State Management**:
   - Import `hasCompletedTutorial`, `completeTutorial`, `skipTutorial` from `useAuth`
   - Add `showTutorial` state
   - Add `useEffect` to check tutorial completion status

2. **Add TutorialGuide Component**:
   - Place at end of component (before closing `</PhoneFrame>`)
   - Wire up `onComplete` and `onSkip` handlers
   - Pass `isActive={showTutorial}`

3. **Verify Selectors**:
   - Check that all tutorial step selectors match actual DOM elements
   - Add `data-tutorial-target` attributes where needed
   - Test that highlights work correctly

4. **Test Flow**:
   - Clear localStorage to simulate first-time user
   - Navigate to Groups screen
   - Verify tutorial appears
   - Test navigation (next/previous)
   - Test skip functionality
   - Verify completion is saved
   - Verify tutorial doesn't show again

## Alternative Approaches Considered

### Approach A: Tooltip-Based (Rejected)
- ❌ Too many tooltips can be overwhelming
- ❌ Hard to show progression
- ❌ Difficult to ensure mobile-friendly sizing

### Approach B: Full-Screen Modal (Rejected)
- ❌ Too intrusive
- ❌ Blocks entire screen
- ❌ Doesn't highlight specific elements

### Approach C: Bottom Sheet with Highlights (✅ Selected)
- ✅ Non-intrusive
- ✅ Highlights specific elements
- ✅ Shows progression
- ✅ Mobile-friendly
- ✅ Can be dismissed easily

## Next Steps

1. Implement the tutorial state management in `GroupsScreen.jsx`
2. Verify and update selectors in tutorial steps
3. Test on mobile viewport (375px width)
4. Ensure smooth animations and transitions
5. Test localStorage persistence
6. Consider adding similar guides to other screens (Search, Profile, etc.)

