export function PhoneFrame({ children, showNavigation = true }) {
  return (
    <div 
      className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-8" 
      style={{ 
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="relative" style={{ zIndex: 10, isolation: 'isolate' }}>
        {/* Phone Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl" style={{ zIndex: 10 }}>
          {/* Screen Bezel */}
          <div className="bg-black rounded-[2.5rem] relative" style={{ overflow: 'hidden', zIndex: 10 }}>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* Screen Content */}
            <div 
              className="relative w-[375px] h-[812px] bg-white phone-screen-content" 
              style={{ 
                position: 'relative', 
                overflow: 'hidden',
                zIndex: 1,
                isolation: 'isolate'
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

