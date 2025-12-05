export function PhoneFrame({ children, showNavigation = true }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="relative">
        {/* Phone Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen Bezel */}
          <div className="bg-black rounded-[2.5rem] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* Screen Content */}
            <div className="relative w-[375px] h-[812px] bg-background overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

