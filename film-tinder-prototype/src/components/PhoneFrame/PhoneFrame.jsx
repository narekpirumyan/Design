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
      <div className="relative z-10">
        {/* Phone Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl" style={{ zIndex: 1 }}>
          {/* Screen Bezel */}
          <div className="bg-black rounded-[2.5rem] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* Screen Content */}
            <div className="relative w-[375px] h-[812px] bg-white overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

