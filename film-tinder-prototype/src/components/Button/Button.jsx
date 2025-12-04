export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-surface text-text-primary hover:bg-surface/80 border border-surface',
    accent: 'bg-accent text-white hover:bg-accent/90',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

