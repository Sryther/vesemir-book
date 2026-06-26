import { useState, useMemo } from 'react'
import { Page } from './Page'
import { playCorrect, playCompleted } from '../sfx'

// Fisher–Yates shuffle (a fresh array each call).
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const blasonUrl = (id) => `${import.meta.env.BASE_URL}banners/${id}.svg`

export default function BannerHunt({ kingdoms, onComplete, onBack, finished }) {
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(0)
  const [found, setFound] = useState(false)
  const [wrong, setWrong] = useState({}) // id -> true for the current round
  const [feedback, setFeedback] = useState('')
  const [flipDir, setFlipDir] = useState('fwd')

  const total = kingdoms.length
  const kingdom = kingdoms[round]
  const done = round >= total

  // Four banners per round: the right one + three decoys, shuffled. Recomputed
  // only when the round changes, so a wrong guess doesn't reshuffle the board.
  const options = useMemo(() => {
    if (!kingdom) return []
    const decoys = shuffle(kingdoms.filter((k) => k.id !== kingdom.id)).slice(0, 3)
    return shuffle([kingdom, ...decoys])
  }, [round]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (k) => {
    if (found) return
    if (k.id === kingdom.id) {
      setFlipDir('fwd')
      setFound(true)
      setFeedback('')
      // last kingdom clears the whole "Bannières" chapter
      if (round + 1 >= total) playCompleted()
      else playCorrect()
    } else {
      setWrong((w) => ({ ...w, [k.id]: true }))
      setFeedback("Ce n'est pas son blason, élève. Regarde encore.")
    }
  }

  const next = () => {
    setFlipDir('fwd')
    setFound(false)
    setWrong({})
    setFeedback('')
    setRound((r) => r + 1)
  }

  const startHunt = () => {
    setFlipDir('fwd')
    setRound(0)
    setFound(false)
    setWrong({})
    setStarted(true)
  }

  const backCorner = { label: 'Le grimoire', onClick: onBack }
  const stepKey = !started ? 'intro' : done ? 'done' : `r${round}-${found ? 'f' : 'g'}`

  let body
  // ---- Intro to the chapter ----
  if (!started) {
    body = (
      <Page
        back={backCorner}
        next={
          finished
            ? { label: 'Aller au présent', onClick: onComplete }
            : { label: 'Étudier les blasons', onClick: startHunt }
        }
      >
        <div className="subtitle">Deuxième leçon</div>
        <h2 className="title">Les Bannières du Nord</h2>
        <div className="flourish">⚜ ⚜ ⚜</div>
        <div className="prose dropcap">
          <p>
            Bien, mon élève. Tu connais désormais tes décoctions — mais un
            sorceleur ne marche pas le nez dans sa sacoche. Sur les routes, tu
            traverseras mille fiefs, et chaque royaume porte ses couleurs comme
            un homme porte son visage.
          </p>
          <p>
            Savoir lire une bannière, c'est savoir où l'on pose le pied : chez
            un ami, chez un roi méfiant, ou en pleine terre de guerre. Apprends
            les blasons du Nord ; ils t'auront sauvé la vie avant même que tu
            n'aies dégainé.
          </p>
          <p>
            Je vais te nommer un royaume. À toi de retrouver, parmi les
            étendards, celui qui lui appartient.
          </p>
        </div>
        {finished && (
          <div className="actions">
            <button className="btn" onClick={startHunt}>
              Réviser les blasons
            </button>
          </div>
        )}
      </Page>
    )
  } else if (done) {
    // ---- Closing screen, once every kingdom is recognised ----
    body = (
      <Page
        back={backCorner}
        next={{ label: 'Le secret de Vesemir', onClick: onComplete }}
      >
        <div className="subtitle">Leçon retenue</div>
        <h2 className="title">Tu connais le Nord</h2>
        <div className="flourish">✦ ✦ ✦</div>
        <p className="prose">
          Voilà. Tu sauras désormais reconnaître, de loin, sous quelles couleurs
          tu chevauches. Un sorceleur averti franchit bien des frontières sans
          jamais croiser le fer.
        </p>
        <p className="prose riddle">
          Il ne te reste plus qu'une chose à découvrir, mon élève — le secret
          que j'ai gardé pour toi seul.
        </p>
      </Page>
    )
  } else if (found) {
    // ---- A solved round: reveal + description ----
    body = (
      <Page
        back={backCorner}
        next={{
          label: round + 1 < total ? 'Royaume suivant' : 'Achever la leçon',
          onClick: next,
        }}
      >
        <div className="subtitle">
          Blason {round + 1} / {total}
        </div>
        <h2 className="title" style={{ fontSize: '2.1rem' }}>
          {kingdom.name}
        </h2>
        <div className="flourish">❧</div>
        <div className="blason-reveal fade-in">
          <img
            className="blason blason-big"
            src={blasonUrl(kingdom.id)}
            alt={`Blason de ${kingdom.name}`}
          />
        </div>
        <div className="prose dropcap fade-in">
          <p>{kingdom.description}</p>
        </div>
        <div className="hint-card fade-in">
          <div className="label">Indice gravé</div>
          <div className="text">« {kingdom.hint} »</div>
        </div>
      </Page>
    )
  } else {
    // ---- A round being guessed ----
    body = (
      <Page back={backCorner}>
        <div className="subtitle">
          Blason {round + 1} / {total}
        </div>
        <h2 className="title" style={{ fontSize: '2.1rem' }}>
          Quel est ce royaume ?
        </h2>
        <div className="flourish">❧</div>
        <p className="prose riddle" style={{ textAlign: 'center' }}>
          Retrouve la bannière du royaume de{' '}
          <span className="kingdom-name">{kingdom.name}</span>.
        </p>
        <div className="banner-grid">
          {options.map((k) => (
            <button
              key={k.id}
              className={`banner-option${wrong[k.id] ? ' wrong' : ''}`}
              onClick={() => pick(k)}
              disabled={wrong[k.id]}
              aria-label="Choisir cette bannière"
            >
              <img className="blason" src={blasonUrl(k.id)} alt="Une bannière" />
            </button>
          ))}
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
