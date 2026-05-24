export default function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
        padding: 24,
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'transform 0.2s, box-shadow 0.2s' : 'none',
        ...style
      }}
      onMouseEnter={e => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow)'
        }
      }}
    >
      {children}
    </div>
  )
}