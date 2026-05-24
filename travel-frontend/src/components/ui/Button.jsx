export default function Button({
  children, onClick, variant = 'primary',
  size = 'md', disabled = false, fullWidth = false,
  type = 'button', style = {}
}) {
  const styles = {
    primary: {
      background: 'var(--terra)',
      color: 'white',
      border: 'none'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--terra)',
      border: '1.5px solid var(--terra)'
    },
    danger: {
      background: 'var(--danger)',
      color: 'white',
      border: 'none'
    },
    ghost: {
      background: 'rgba(196,98,45,0.1)',
      color: 'var(--terra)',
      border: 'none'
    }
  }

  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
    lg: { padding: '14px 28px', fontSize: 15 }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        ...sizes[size],
        borderRadius: 10,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        ...style
      }}
    >
      {children}
    </button>
  )
}