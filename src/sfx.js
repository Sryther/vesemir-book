import { CONFIG } from './gameData'

// Sound effects follow the music's mute state.
let muted = false
export function setSfxMuted(value) {
  muted = value
}

// The background-music element, registered by the music hook so clips can duck it.
let bgEl = null
export function registerMusic(el) {
  bgEl = el
}

// Play a monster clip, ducking (silencing) the background music until it ends.
// Returns the Audio element so callers can track when it finishes.
export function playMonsterClip(url) {
  const clip = new Audio(url)
  const prevVol = bgEl ? bgEl.volume : null
  if (bgEl) bgEl.volume = 0
  const restore = () => {
    if (bgEl && prevVol != null) bgEl.volume = prevVol
  }
  clip.addEventListener('ended', restore, { once: true })
  clip.addEventListener('error', restore, { once: true })
  clip.play().catch(() => restore())
  return clip
}

function play(file, volume) {
  if (muted || !file) return
  try {
    const a = new Audio(`${import.meta.env.BASE_URL}${encodeURIComponent(file)}`)
    a.volume = volume
    a.play().catch(() => {})
  } catch {
    /* ignore — audio not available */
  }
}

// Played each time the player finds a right answer (unless muted).
export function playCorrect() {
  play(CONFIG.sfxCorrect, 0.6)
}

// Played instead of playCorrect when a whole chapter is cleared.
export function playCompleted() {
  play(CONFIG.sfxComplete, 0.7)
}
