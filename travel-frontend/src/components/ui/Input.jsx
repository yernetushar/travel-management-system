export default function Input({
  label, type = 'text', value, onChange,
  placeholder, error, required, style = {}
}) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ink-soft)',
          marginBottom: 6
        }}>
          {label} {required && <span style={{ color: 'var(--terra)' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 14px',
          border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 10,
          background: 'var(--white)',
          color: 'var(--ink)',
          fontSize: 14,
          outline: 'none',
          transition: 'border 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--terra)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
      />
      {error && (
        <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}