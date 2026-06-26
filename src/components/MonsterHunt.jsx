import { useState, useMemo, useEffect } from 'react'
import { Page } from './Page'
import { playCorrect, playCompleted, playMonsterClip } from '../sfx'
import { MONSTER_CHOICES } from '../gameData'
import { MONSTER_ICONS, MONSTER_ICON_FALLBACK } from '../monsterIcons'

const clipUrl = (file) => `${import.meta.env.BASE_URL}monsters/${file}`
const norm = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const slugify = (n) => norm(n).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const iconUrl = (name) =>
  `${import.meta.env.BASE_URL}monsters/icons/${MONSTER_ICONS[slugify(name)] || MONSTER_ICON_FALLBACK}`
const fallbackUrl = `${import.meta.env.BASE_URL}monsters/icons/${MONSTER_ICON_FALLBACK}`

export default function MonsterHunt({ monsters, onComplete, onBack, finished }) {
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(0)
  const [found, setFound] = useState(false)
  const [query, setQuery] = useState('')
  const [wrong, setWrong] = useState({})
  const [feedback, setFeedback] = useState('')
  const [flipDir, setFlipDir] = useState('fwd')

  const total = monsters.length
  const monster = monsters[round]
  const done = round >= total

  // Auto-play the cry whenever a fresh round is shown (the player got here by
  // tapping, so the gesture lets it through; a button replays it on demand).
  useEffect(() => {
    if (started && monster && !found) playMonsterClip(clipUrl(monster.file))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, started])

  const choices = useMemo(() => {
    const q = norm(query.trim())
    return q ? MONSTER_CHOICES.filter((n) => norm(n).includes(q)) : MONSTER_CHOICES
  }, [query])

  const pick = (name) => {
    if (found) return
    if (norm(name) === norm(monster.name)) {
      setFlipDir('fwd')
      setFound(true)
      setFeedback('')
      if (round + 1 >= total) playCompleted()
      else playCorrect()
    } else {
      setWrong((w) => ({ ...w, [name]: true }))
      setFeedback("Ce n'est pas la créature que tu entends, élève.")
    }
  }

  const next = () => {
    setFlipDir('fwd')
    setFound(false)
    setQuery('')
    setWrong({})
    setFeedback('')
    setRound((r) => r + 1)
  }

  const startHunt = () => {
    setFlipDir('fwd')
    setRound(0)
    setFound(false)
    setQuery('')
    setWrong({})
    setFeedback('')
    setStarted(true)
  }

  const backCorner = { label: 'Le grimoire', onClick: onBack }
  const stepKey = !started ? 'intro' : done ? 'done' : `r${round}-${found ? 'f' : 'g'}`

  let body
  if (!started) {
    body = (
      <Page
        back={backCorner}
        next={
          finished
            ? { label: 'Aller au présent', onClick: onComplete }
            : { label: 'Tendre l’oreille', onClick: startHunt }
        }
      >
        <div className="subtitle">Troisième leçon</div>
        <h2 className="title">L'oreille du Sorceleur</h2>
        <div className="flourish">⚜ ⚜ ⚜</div>
        <div className="prose dropcap">
          <p>
            Un sorceleur tue ce qu'il connaît, mon élève. Et bien souvent, c'est
            l'oreille qui reconnaît la bête avant l'œil : un cri dans la nuit, un
            râle au fond d'un marais, un battement d'ailes de trop.
          </p>
          <p>
            Je vais te faire entendre des créatures, tapies dans l'obscurité de
            ces pages. À chaque cri, nomme le monstre qui le pousse. Tu peux
            réécouter autant qu'il le faut — la musique se taira le temps que la
            bête gronde.
          </p>
        </div>
        {finished && (
          <div className="actions">
            <button className="btn" onClick={startHunt}>
              Réécouter les créatures
            </button>
          </div>
        )}
      </Page>
    )
  } else if (done) {
    body = (
      <Page back={backCorner} next={{ label: 'Le secret de Vesemir', onClick: onComplete }}>
        <div className="subtitle">Leçon retenue</div>
        <h2 className="title">Ton oreille est sûre</h2>
        <div className="flourish">✦ ✦ ✦</div>
        <p className="prose">
          Bien. Tu sauras désormais nommer la bête à l'oreille, dans le noir,
          avant même qu'elle ne fonde sur toi. Peu de sorceleurs peuvent en dire
          autant.
        </p>
        <p className="prose riddle">
          Voilà la dernière de tes épreuves franchie, mon élève. Il est temps.
        </p>
      </Page>
    )
  } else if (found) {
    body = (
      <Page back={backCorner} next={{ label: round + 1 < total ? 'Créature suivante' : 'Achever la leçon', onClick: next }}>
        <div className="subtitle">
          Créature {round + 1} / {total}
        </div>
        <h2 className="title word-reveal" style={{ fontSize: '2rem' }}>
          {monster.name}
        </h2>
        <div className="flourish">❧</div>
        <div className="monster-portrait fade-in">
          <img
            src={iconUrl(monster.name)}
            alt={monster.name}
            onError={(e) => {
              if (e.currentTarget.src !== fallbackUrl) e.currentTarget.src = fallbackUrl
            }}
          />
        </div>
        <div className="actions" style={{ marginTop: 0, paddingTop: 0 }}>
          <button className="btn" onClick={() => playMonsterClip(clipUrl(monster.file))}>
            ▶ Réécouter le cri
          </button>
        </div>
        <div className="hint-card fade-in">
          <div className="label">Indice gravé</div>
          <div className="text">« {monster.hint} »</div>
        </div>
      </Page>
    )
  } else {
    body = (
      <Page back={backCorner}>
        <div className="subtitle">
          Créature {round + 1} / {total}
        </div>
        <h2 className="title" style={{ fontSize: '2rem' }}>
          Quel monstre entends-tu ?
        </h2>
        <div className="flourish">❧</div>
        <div className="monster-play">
          <button
            className="btn gold roar"
            onClick={() => playMonsterClip(clipUrl(monster.file))}
          >
            ▶ Écouter le cri
          </button>
          <p className="prose riddle" style={{ textAlign: 'center', margin: '0.4em 0 0' }}>
            Cherche son nom dans le bestiaire, puis désigne-le.
          </p>
        </div>
        <input
          className="monster-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une créature…"
          aria-label="Rechercher une créature"
        />
        <div className="monster-choices">
          {choices.map((name) => (
            <button
              key={name}
              className={`monster-choice${wrong[name] ? ' wrong' : ''}`}
              onClick={() => pick(name)}
              disabled={wrong[name]}
            >
              <img
                className="micon"
                src={iconUrl(name)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== fallbackUrl) e.currentTarget.src = fallbackUrl
                }}
              />
              <span className="mname">{name}</span>
            </button>
          ))}
          {choices.length === 0 && (
            <p className="feedback" style={{ margin: 0 }}>Aucune créature de ce nom.</p>
          )}
        </div>
        <p className="feedback">{feedback || ' '}</p>
      </Page>
    )
  }

  return (
    <div className={`page-flip ${flipDir}`} key={stepKey}>
      {body}
    </div>
  )
}
