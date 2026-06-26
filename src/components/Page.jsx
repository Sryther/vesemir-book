import { useRef } from 'react'

// A folded page corner used to turn pages: `back` (bottom-left) / `next` (bottom-right).
export function PageCorner({ side, label, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`page-corner ${side}${disabled ? ' disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <span className="fold" aria-hidden="true" />
      <span className="arrow" aria-hidden="true">
        {side === 'next' ? '❯' : '❮'}
      </span>
      <span className="corner-label">{label}</span>
    </button>
  )
}

// The parchment frame: scrolling content + optional folded navigation corners.
// On touch screens, a horizontal swipe triggers the same corners (when present):
// swipe left → next (bottom-right), swipe right → back (bottom-left).
export function Page({ className = '', children, back, next }) {
  const start = useRef(null)

  const onTouchStart = (e) => {
    const t = e.changedTouches[0]
    start.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    const s = start.current
    start.current = null
    if (!s) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s.x
    const dy = t.clientY - s.y
    // require a clearly horizontal swipe so vertical scrolling is unaffected
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) {
      if (next && !next.disabled) next.onClick()
    } else {
      if (back && !back.disabled) back.onClick()
    }
  }

  return (
    <div className={`page ${className}`.trim()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="page-inner">{children}</div>
      {back && (
        <PageCorner side="back" label={back.label} onClick={back.onClick} disabled={back.disabled} />
      )}
      {next && (
        <PageCorner side="next" label={next.label} onClick={next.onClick} disabled={next.disabled} />
      )}
    </div>
  )
}
