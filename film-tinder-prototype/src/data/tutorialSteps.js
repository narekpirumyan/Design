// Tutorial steps for each navigation section

export const tutorialSteps = {
  swipe: [
    {
      title: 'Welcome to Swipe Mode',
      description: 'Discover movies by swiping left or right, just like Tinder! Swipe right to like, left to pass.',
      icon: null,
      action: null,
      targetSelector: null
    },
    {
      title: 'Swipe to Browse',
      description: 'Swipe right on movies you like, or swipe left to pass. The card will show "LIKE" or "PASS" as you swipe.',
      icon: null,
      action: 'Try swiping right on a movie you like!',
      targetSelector: '[data-tutorial-target="swipe-area"]'
    },
    {
      title: 'Mode Switch Button',
      description: 'Tap this button to switch between different viewing modes: swipe cards, details, or trailers.',
      icon: null,
      action: 'Try tapping the mode button to explore different views!',
      targetSelector: '[data-tutorial-target="mode-switch"]'
    },
    {
      title: 'Mood Button',
      description: 'Change your current mood to get personalized movie recommendations that match how you\'re feeling.',
      icon: null,
      action: 'Tap the mood button to see available moods!',
      targetSelector: '[data-tutorial-target="mood-button"]'
    },
    {
      title: 'Add to Watchlist',
      description: 'When you swipe right on a movie, you can add it to a group watchlist to watch with friends later.',
      icon: null,
      action: 'Swipe right on a movie to see the watchlist options!',
      targetSelector: null
    }
  ],
  scroll: [
    {
      title: 'Welcome to Scroll Mode',
      description: 'Browse movies by scrolling up and down, just like Instagram or TikTok! Each movie fills the screen.',
      icon: null,
      action: null,
      targetSelector: null
    },
    {
      title: 'Scroll to Browse',
      description: 'Scroll up to see the next movie, or scroll down to go back. Each movie is full-screen for an immersive experience.',
      icon: null,
      action: 'Try scrolling up to see the next movie!',
      targetSelector: '[data-tutorial-target="scroll-area"]'
    },
    {
      title: 'Action Buttons',
      description: 'Use the buttons on the right side: bookmark to save, comment to discuss, or tap the movie card for more options.',
      icon: null,
      action: 'Try tapping the bookmark button to save a movie!',
      targetSelector: '[data-tutorial-target="scroll-actions"]'
    },
    {
      title: 'Mode Switch Button',
      description: 'Tap this button to switch between different viewing modes: scroll cards, details, or trailers.',
      icon: null,
      action: 'Try tapping the mode button to explore different views!',
      targetSelector: '[data-tutorial-target="mode-switch"]'
    },
    {
      title: 'Mood Button',
      description: 'Change your current mood to get personalized movie recommendations that match how you\'re feeling.',
      icon: null,
      action: 'Tap the mood button to see available moods!',
      targetSelector: '[data-tutorial-target="mood-button"]'
    }
  ],
  groups: [
    {
      title: 'Groups & Watchlist',
      description: 'Here you can manage your personal watchlist and create or join groups to watch movies together with friends.',
      icon: null,
      action: null,
      targetSelector: null
    },
    {
      title: 'Personal Watchlist',
      description: 'Your personal watchlist appears at the top. All movies you like are automatically saved here.',
      icon: null,
      action: 'Tap your personal watchlist to see all your saved movies!',
      targetSelector: '[data-tutorial-target="personal-watchlist"]'
    },
    {
      title: 'Your Groups',
      description: 'See all your active groups here. Each group has its own watchlist and movie selection.',
      icon: null,
      action: 'Tap on a group to start swiping movies together!',
      targetSelector: '.group-card'
    },
    {
      title: 'Create New Group',
      description: 'Start a new group session by tapping the "Create New Group" button. Share the room code with friends!',
      icon: null,
      action: 'Try creating a group to see how it works!',
      targetSelector: '[data-tutorial-target="create-group"]'
    },
    {
      title: 'Friends Tab',
      description: 'Switch to the Friends tab to see your friends and invite them to groups.',
      icon: null,
      action: 'Explore your friends list!',
      targetSelector: '[data-tutorial-target="friends-tab"]'
    }
  ],
  search: [
    {
      title: 'Search Movies',
      description: 'Find movies by searching with keywords or using filters like genre, year, mood, and streaming service.',
      icon: null,
      action: null,
      targetSelector: null
    },
    {
      title: 'Search Bar',
      description: 'Type to search by movie title, description, or genre. Results update as you type.',
      icon: null,
      action: 'Try searching for a movie title!',
      targetSelector: 'input[type="text"][placeholder*="Search"]'
    },
    {
      title: 'Filters',
      description: 'Tap the Filters button to refine your search by genre, year range, mood, or streaming service.',
      icon: null,
      action: 'Open filters to see all available options!',
      targetSelector: 'button:contains("Filters")'
    },
    {
      title: 'Search Results',
      description: 'Browse through your search results. Each movie shows key information to help you decide.',
      icon: null,
      action: 'Try different search terms or filters!',
      targetSelector: null
    }
  ],
  profile: [
    {
      title: 'Your Profile',
      description: 'View your stats, manage your preferences, and customize your movie discovery experience.',
      icon: null,
      action: null,
      targetSelector: null
    },
    {
      title: 'Your Stats',
      description: 'See how many movies you\'ve liked, groups you\'ve joined, and movies in your watchlist.',
      icon: null,
      action: 'Keep swiping to increase your stats!',
      targetSelector: '.stats, [class*="grid grid-cols-3"]'
    },
    {
      title: 'Interaction Mode',
      description: 'Tap Interaction Mode to change how you browse movies - choose between Tinder-like swipe or Instagram-like scroll.',
      icon: null,
      action: 'Open Interaction Mode to change your browsing style!',
      targetSelector: 'button:contains("Interaction Mode")'
    },
    {
      title: 'Privacy & Terms',
      description: 'Access Privacy Policy, Terms of Service, and Contact Us options from your profile.',
      icon: null,
      action: 'Check out Privacy and Terms options!',
      targetSelector: null
    }
  ],
  groupDetails: [
    {
      title: 'Group Details',
      description: 'Here you can view group information, manage members, see added movies, and start a movie session together.',
      icon: null,
      action: null,
      targetSelector: null
    },
    {
      title: 'Start Movie Session',
      description: 'Tap "Start Movie Session" to begin swiping movies together with your group. Everyone swipes and you\'ll find matches!',
      icon: null,
      action: 'Tap the Start Movie Session button to begin!',
      targetSelector: '[data-tutorial-target="start-session"]'
    },
    {
      title: 'Movies Tab',
      description: 'See all movies that have been added to this group. Each movie shows who added it and when.',
      icon: null,
      action: 'Check out the movies tab to see what\'s been added!',
      targetSelector: '[data-tutorial-target="movies-tab"]'
    },
    {
      title: 'Members Tab',
      description: 'View all group members, see who\'s online, and add new members to the group.',
      icon: null,
      action: 'Explore the Members tab to see who\'s in your group!',
      targetSelector: '[data-tutorial-target="members-tab"]'
    },
    {
      title: 'History Tab',
      description: 'View your group\'s movie watching history - see what movies you\'ve watched together and ratings.',
      icon: null,
      action: 'Check the History tab to see past sessions!',
      targetSelector: '[data-tutorial-target="history-tab"]'
    }
  ],
  room: [
    {
      title: 'Group Movie Session',
      description: 'This is where you swipe movies together with your group. Everyone swipes and the app finds movies you all like!',
      icon: null,
      action: null,
      targetSelector: null
    },
    {
      title: 'Swipe Together',
      description: 'Swipe right to like a movie, left to pass. Everyone in the group swipes, and you\'ll see matches when you all like the same movie!',
      icon: null,
      action: 'Try swiping on a movie - your group members will see your choice!',
      targetSelector: '.swipe-area, [class*="relative w-full h-full"]'
    },
    {
      title: 'Participants',
      description: 'See who\'s in the session with you. You can see their avatars and activity status.',
      icon: null,
      action: 'Check who\'s participating in the session!',
      targetSelector: '[data-tutorial-target="participants"]'
    },
    {
      title: 'Room Code',
      description: 'Share the room code with friends so they can join the session. They can enter the code to join!',
      icon: null,
      action: 'Share the room code to invite more friends!',
      targetSelector: '[data-tutorial-target="room-code"]'
    },
    {
      title: 'View Matches',
      description: 'When you\'ve all swiped through movies, you can view matches - movies that everyone (or most people) liked!',
      icon: null,
      action: 'Keep swiping to find matches with your group!',
      targetSelector: null
    }
  ]
}

// Helper function to get steps with user context
export function getTutorialSteps(sectionId, user = null) {
  const steps = tutorialSteps[sectionId] || []
  
  return steps.map(step => ({
    ...step,
    description: typeof step.description === 'function' 
      ? step.description(user?.preferences?.interactionModel) 
      : step.description,
    icon: typeof step.icon === 'function' 
      ? step.icon(user?.preferences?.interactionModel) 
      : step.icon,
    action: typeof step.action === 'function' 
      ? step.action(user?.preferences?.interactionModel) 
      : step.action
  }))
}

