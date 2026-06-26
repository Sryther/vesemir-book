import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { playCorrect, playCompleted } from '../sfx'

const MAX_TRIES = 6
const ROWS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'DEL'],
]

const normalize = (c) =>
  c.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()

// Wordle-style scoring with correct duplicate handling.
function score(guess, answer) {
  const res = Array(guess.length).fill('absent')
  const counts = {}
  for (const ch of answer) counts[ch] = (counts[ch] || 0) + 1
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      res[i] = 'correct'
      counts[guess[i]]--
    }
  }
  for (let i = 0; i < guess.length; i++) {
    if (res[i] === 'correct') continue
    if (counts[guess[i]] > 0) {
      res[i] = 'present'
      counts[guess[i]]--
    }
  }
  return res
}

export default function Motus({ answer, onSolved, completes }) {
  const len = answer.length
  // Typeable positions: every index that is not a space. Spaces are fixed
  // separators between words — the player never types them.
  const slots = useMemo(() => {
    const s = []
    for (let i = 0; i < answer.length; i++) if (answer[i] !== ' ') s.push(i)
    return s
  }, [answer])
  const letterCount = slots.length
  const first = answer[slots[0]] // first letter is offered for free

  // `typed` holds only the letters entered (no spaces), starting with the gift.
  const [typed, setTyped] = useState(first)
  const [guesses, setGuesses] = useState([]) // {letters, marks}
  const [feedback, setFeedback] = useState('')
  const [won, setWon] = useState(false)
  const solvedRef = useRef(false)

  const tier = len >= 13 ? 'micro' : len >= 9 ? 'tiny' : ''

  // Lay the typed letters back into the full word, keeping spaces in place.
  const fullFromTyped = useCallback(
    (t) => {
      const arr = answer.split('').map((ch) => (ch === ' ' ? ' ' : ' '))
      for (let k = 0; k < t.length; k++) arr[slots[k]] = t[k]
      return arr.join('')
    },
    [answer, slots],
  )

  const submit = useCallback(() => {
    if (won) return
    if (typed.length !== letterCount) {
      setFeedback(`Le nom compte ${letterCount} lettres.`)
      return
    }
    const full = fullFromTyped(typed)
    const marks = score(full, answer)
    const next = [...guesses, { letters: full, marks }]
    setGuesses(next)
    if (full === answer) {
      setWon(true)
      setFeedback('')
      if (completes) playCompleted()
      else playCorrect()
    } else if (next.length >= MAX_TRIES) {
      setFeedback(`Le nom était : ${answer}. Réessaie.`)
      // soft reset so they can keep trying (it's a gift, not an exam)
      setTimeout(() => {
        setGuesses([])
        setTyped(first)
        setFeedback('')
      }, 2600)
    } else {
      setFeedback('')
    }
    setTyped(first)
  }, [typed, guesses, won, answer, letterCount, first, fullFromTyped, completes])

  const press = useCallback(
    (key) => {
      if (won) return
      setFeedback('')
      if (key === 'ENTER') return submit()
      if (key === 'DEL') {
        setTyped((t) => (t.length > 1 ? t.slice(0, -1) : t))
        return
      }
      setTyped((t) => (t.length < letterCount ? t + key : t))
    },
    [won, submit, letterCount],
  )

  // physical keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') press('ENTER')
      else if (e.key === 'Backspace') press('DEL')
      else if (/^[a-zA-Z]$/.test(e.key)) press(normalize(e.key))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [press])

  useEffect(() => {
    if (won && !solvedRef.current) {
      solvedRef.current = true
      const t = setTimeout(() => onSolved(), 850)
      return () => clearTimeout(t)
    }
  }, [won, onSolved])

  // best status per key for the keyboard coloring (spaces ignored)
  const keyStatus = {}
  const rank = { absent: 0, present: 1, correct: 2 }
  for (const g of guesses) {
    for (let i = 0; i < g.letters.length; i++) {
      const k = g.letters[i]
      if (k === ' ') continue
      if (!keyStatus[k] || rank[g.marks[i]] > rank[keyStatus[k]]) keyStatus[k] = g.marks[i]
    }
  }

  const rows = []
  for (let r = 0; r < MAX_TRIES; r++) {
    if (guesses[r]) {
      rows.push(guesses[r])
    } else if (r === guesses.length && !won) {
      rows.push({ active: true, letters: fullFromTyped(typed) })
    } else {
      rows.push({ letters: ' '.repeat(len) })
    }
  }

  return (
    <div className="motus">
      <div className="motus-grid">
        {rows.map((row, r) => (
          <div className="motus-row" key={r}>
            {Array.from({ length: len }).map((_, c) => {
              // A space in the answer is a fixed word separator: blank cell.
              if (answer[c] === ' ') {
                return (
                  <div
                    className={`motus-cell space${tier ? ' ' + tier : ''}`}
                    key={c}
                    aria-hidden="true"
                  />
                )
              }
              const ch = row.letters[c] || ' '
              const cls = ['motus-cell']
              if (tier) cls.push(tier)
              if (row.marks) cls.push(row.marks[c])
              else if (row.active && ch !== ' ') cls.push('filled')
              return (
                <div className={cls.join(' ')} key={c}>
                  {ch.trim()}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {won ? (
        <p className="feedback" style={{ color: 'var(--gold)' }}>
          ✦ {answer} ✦
        </p>
      ) : (
        <p className="feedback">{feedback || `Première lettre offerte : ${first}`}</p>
      )}

      {!won && (
        <div className="kbd">
          {ROWS.map((row, i) => (
            <div className="kbd-row" key={i}>
              {row.map((k) => {
                const cls = ['key']
                if (k === 'ENTER' || k === 'DEL') cls.push('wide')
                if (keyStatus[k]) cls.push(keyStatus[k])
                return (
                  <button className={cls.join(' ')} key={k} onClick={() => press(k)}>
                    {k === 'DEL' ? '⌫' : k === 'ENTER' ? 'Valider' : k}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
