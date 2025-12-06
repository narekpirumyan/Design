// Tutorial steps for each navigation section

export const tutorialSteps = {
  swipe: [
    {
      title: 'Welcome to Movie Discovery! 🎬',
      description: 'This is where you discover movies by swiping or scrolling through recommendations.',
      icon: '🎬',
      action: null,
      targetSelector: null
    },
    {
      title: 'Swipe or Scroll',
      description: userModel => {
        const model = userModel || 'swipe'
        if (model === 'scroll') {
          return 'Scroll up and down to browse movies. Tap the heart to like, X to pass, or info for details.'
        }
        return 'Swipe right to like a movie, or swipe left to pass. You can also use the buttons on screen.'
      },
      icon: userModel => userModel === 'scroll' ? '📱' : '👆',
      action: userModel => {
        if (userModel === 'scroll') {
          return 'Try scrolling up to see the next movie!'
        }
        return 'Try swiping right on a movie you like!'
      },
      targetSelector: '.swipe-area, .scroll-area, [class*="relative w-full h-full"]'
    },
    {
      title: 'Mode Switch Button',
      description: 'Tap this button to switch between different viewing modes: swipe cards, details, or trailers.',
      icon: '🔄',
      action: 'Try tapping the mode button to explore different views!',
      targetSelector: 'button[aria-label*="Switch"], button[title*="Switch"]'
    },
    {
      title: 'Add to Watchlist',
      description: 'When you like a movie, you can add it to a group watchlist to watch with friends later.',
      icon: '❤️',
      action: 'Swipe right on a movie to see the watchlist options!',
      targetSelector: null
    }
  ],
  groups: [
    {
      title: 'Groups & Watchlist 👥',
      description: 'Here you can manage your personal watchlist and create or join groups to watch movies together with friends.',
      icon: '👥',
      action: null,
      targetSelector: null
    },
    {
      title: 'Personal Watchlist',
      description: 'Your personal watchlist appears at the top. All movies you like are automatically saved here.',
      icon: '📝',
      action: 'Tap your personal watchlist to see all your saved movies!',
      targetSelector: '[class*="from-pink-500 to-red-500"]'
    },
    {
      title: 'Your Groups',
      description: 'See all your active groups here. Each group has its own watchlist and movie selection.',
      icon: '📋',
      action: 'Tap on a group to start swiping movies together!',
      targetSelector: '.group-card'
    },
    {
      title: 'Create New Group',
      description: 'Start a new group session by tapping the "Create New Group" button. Share the room code with friends!',
      icon: '➕',
      action: 'Try creating a group to see how it works!',
      targetSelector: '[data-tutorial-target="create-group"]'
    },
    {
      title: 'Friends Tab',
      description: 'Switch to the Friends tab to see your friends and invite them to groups.',
      icon: '👤',
      action: 'Explore your friends list!',
      targetSelector: '[data-tutorial-target="friends-tab"]'
    }
  ],
  search: [
    {
      title: 'Search Movies 🔍',
      description: 'Find movies by searching with keywords or using filters like genre, year, mood, and streaming service.',
      icon: '🔍',
      action: null,
      targetSelector: null
    },
    {
      title: 'Search Bar',
      description: 'Type to search by movie title, description, or genre. Results update as you type.',
      icon: '⌨️',
      action: 'Try searching for a movie title!',
      targetSelector: 'input[type="text"][placeholder*="Search"]'
    },
    {
      title: 'Filters',
      description: 'Tap the Filters button to refine your search by genre, year range, mood, or streaming service.',
      icon: '🎛️',
      action: 'Open filters to see all available options!',
      targetSelector: 'button:contains("Filters")'
    },
    {
      title: 'Search Results',
      description: 'Browse through your search results. Each movie shows key information to help you decide.',
      icon: '📋',
      action: 'Try different search terms or filters!',
      targetSelector: null
    }
  ],
  profile: [
    {
      title: 'Your Profile 👤',
      description: 'View your stats, manage your preferences, and customize your movie discovery experience.',
      icon: '👤',
      action: null,
      targetSelector: null
    },
    {
      title: 'Your Stats',
      description: 'See how many movies you\'ve liked, groups you\'ve joined, and movies in your watchlist.',
      icon: '📊',
      action: 'Keep swiping to increase your stats!',
      targetSelector: '.stats, [class*="grid grid-cols-3"]'
    },
    {
      title: 'Interaction Mode',
      description: 'Tap Interaction Mode to change how you browse movies - choose between Tinder-like swipe or Instagram-like scroll.',
      icon: '⚙️',
      action: 'Open Interaction Mode to change your browsing style!',
      targetSelector: 'button:contains("Interaction Mode")'
    },
    {
      title: 'Privacy & Terms',
      description: 'Access Privacy Policy, Terms of Service, and Contact Us options from your profile.',
      icon: '🔒',
      action: 'Check out Privacy and Terms options!',
      targetSelector: null
    }
  ],
  groupDetails: [
    {
      title: 'Group Details 📋',
      description: 'Here you can view group information, manage members, see added movies, and start a movie session together.',
      icon: '📋',
      action: null,
      targetSelector: null
    },
    {
      title: 'Start Movie Session',
      description: 'Tap "Start Movie Session" to begin swiping movies together with your group. Everyone swipes and you\'ll find matches!',
      icon: '🎬',
      action: 'Tap the Start Movie Session button to begin!',
      targetSelector: '[data-tutorial-target="start-session"]'
    },
    {
      title: 'Movies Tab',
      description: 'See all movies that have been added to this group. Each movie shows who added it and when.',
      icon: '🎥',
      action: 'Check out the movies tab to see what\'s been added!',
      targetSelector: '[data-tutorial-target="movies-tab"]'
    },
    {
      title: 'Members Tab',
      description: 'View all group members, see who\'s online, and add new members to the group.',
      icon: '👥',
      action: 'Explore the Members tab to see who\'s in your group!',
      targetSelector: '[data-tutorial-target="members-tab"]'
    },
    {
      title: 'History Tab',
      description: 'View your group\'s movie watching history - see what movies you\'ve watched together and ratings.',
      icon: '📜',
      action: 'Check the History tab to see past sessions!',
      targetSelector: '[data-tutorial-target="history-tab"]'
    }
  ],
  room: [
    {
      title: 'Group Movie Session 🎬',
      description: 'This is where you swipe movies together with your group. Everyone swipes and the app finds movies you all like!',
      icon: '🎬',
      action: null,
      targetSelector: null
    },
    {
      title: 'Swipe Together',
      description: 'Swipe right to like a movie, left to pass. Everyone in the group swipes, and you\'ll see matches when you all like the same movie!',
      icon: '👆',
      action: 'Try swiping on a movie - your group members will see your choice!',
      targetSelector: '.swipe-area, [class*="relative w-full h-full"]'
    },
    {
      title: 'Participants',
      description: 'See who\'s in the session with you. You can see their avatars and activity status.',
      icon: '👥',
      action: 'Check who\'s participating in the session!',
      targetSelector: '[data-tutorial-target="participants"]'
    },
    {
      title: 'Room Code',
      description: 'Share the room code with friends so they can join the session. They can enter the code to join!',
      icon: '🔢',
      action: 'Share the room code to invite more friends!',
      targetSelector: '[data-tutorial-target="room-code"]'
    },
    {
      title: 'View Matches',
      description: 'When you\'ve all swiped through movies, you can view matches - movies that everyone (or most people) liked!',
      icon: '❤️',
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

